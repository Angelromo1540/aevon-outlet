const express = require('express');
const { sql, conectarBD } = require('../config/database');

const router = express.Router();

router.get('/categories', async (req, res) => {
    try {
        const pool = await conectarBD();
        const result = await pool.request().query(`
            SELECT IdCategoria AS id, Nombre AS name, Slug AS slug
            FROM dbo.Categorias
            WHERE Estado = 1
            ORDER BY Nombre;
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al consultar categorias:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron consultar las categorias' });
    }
});

async function consultarProductos(id = null) {
    const pool = await conectarBD();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT p.IdProducto AS id, p.SKU AS sku,
                   p.Nombre AS name, c.Nombre AS category,
                   p.Precio AS price, p.PrecioOriginal AS originalPrice,
                   p.CalificacionDemo AS rating, p.Descripcion AS description,
                   (SELECT TOP (1) i.URL FROM dbo.ImagenesProducto i
                    WHERE i.IdProducto = p.IdProducto
                    ORDER BY i.Orden, i.IdImagen) AS image,
                   (SELECT v.IdVariante AS id, v.SKU AS sku,
                           v.Talla AS size, v.Color AS color,
                           v.Existencias AS stock
                    FROM dbo.Variantes v
                    WHERE v.IdProducto = p.IdProducto AND v.Estado = 1
                    ORDER BY v.IdVariante FOR JSON PATH) AS variantesJson,
                   (SELECT e.Atributo AS atributo, e.Valor AS valor
                    FROM dbo.EspecificacionesProducto e
                    WHERE e.IdProducto = p.IdProducto
                    ORDER BY e.IdEspecificacion FOR JSON PATH) AS specsJson
            FROM dbo.Productos p
            INNER JOIN dbo.Categorias c ON c.IdCategoria = p.IdCategoria
            WHERE p.Estado = 1 AND c.Estado = 1
              AND (@id IS NULL OR p.IdProducto = @id)
            ORDER BY p.IdProducto;
        `);

    return result.recordset.map(({ variantesJson, specsJson, ...p }) => {
        const variants = JSON.parse(variantesJson || '[]');
        const specs = Object.fromEntries(JSON.parse(specsJson || '[]')
            .map(e => [e.atributo, e.valor]));
        const price = Number(p.price);
        const originalPrice = Number(p.originalPrice);
        const discount = originalPrice > 0
            ? Math.floor((originalPrice - price) * 100 / originalPrice) : 0;
        return {
            ...p, price, originalPrice,
            rating: Number(p.rating ?? 0),
            ratingIsDemo: true,
            image: p.image || '',
            discountBadge: discount > 0 ? `${discount}% OFF` : '',
            stock: variants.reduce((total, v) => total + v.stock, 0),
            specs, variants
        };
    });
}

router.get('/products', async (req, res) => {
    try {
        res.json(await consultarProductos());
    } catch (error) {
        console.error('Error al consultar productos:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron consultar los productos' });
    }
});

router.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isInteger(id) || id < 1 || id > 2147483647) {
        return res.status(400).json({ mensaje: 'ID de producto no valido' });
    }
    try {
        const [producto] = await consultarProductos(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al consultar producto:', error.message);
        res.status(500).json({ mensaje: 'No se pudo consultar el producto' });
    }
});

module.exports = router;
