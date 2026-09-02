import { Injectable, signal } from '@angular/core';
import { Product } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([
    // --- BLAZERS & SASTRERÍA ---
    {
      id: 1,
      name: 'Blazer de Lana Sartorial Oxford',
      category: 'Blazers',
      price: 1890,
      originalPrice: 3200,
      discountBadge: '40% OFF',
      rating: 4.8,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      description: 'Confeccionado en mezcla de lana italiana con solapa de muesca y forro interior de viscosa.',
      specs: { 'Material': '70% Lana, 30% Poliéster', 'Corte': 'Slim Fit', 'Origen': 'Portugal' }
    },
    {
      id: 2,
      name: 'Saco Cruzado Doble Botonadura Camel',
      category: 'Blazers',
      price: 2150,
      originalPrice: 3800,
      discountBadge: '43% OFF',
      rating: 4.9,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      description: 'Estructura clásica con solapa en pico, botones en tono cuerno y bolsillos de ojal.',
      specs: { 'Material': '80% Lana Virgen, 20% Cachemira', 'Corte': 'Tailored Fit', 'Color': 'Camel Tostado' }
    },
    {
      id: 3,
      name: 'Blazer Casual Desestructurado Marino',
      category: 'Blazers',
      price: 1420,
      originalPrice: 2400,
      discountBadge: '40% OFF',
      rating: 4.6,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      description: 'Sin hombreras rígidas para una caída natural y movimiento cómodo.',
      specs: { 'Material': '100% Algodón Peinado', 'Corte': 'Modern Casual', 'Cuidado': 'Tintorería' }
    },

    // --- ABRIGOS & CHAMARRAS ---
    {
      id: 4,
      name: 'Chamarra Biker Cuero Genuino',
      category: 'Abrigos',
      price: 2450,
      originalPrice: 4900,
      discountBadge: '50% OFF',
      rating: 4.9,
      stock: 2,
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
      description: 'Piel genuina de grano entero con forro satinado y cierres metálicos YKK.',
      specs: { 'Material': '100% Piel Vacuna', 'Forro': 'Poliéster Satinado', 'Color': 'Negro Mate' }
    },
    {
      id: 5,
      name: 'Abrigo Largo Overcoat Carbón',
      category: 'Abrigos',
      price: 2890,
      originalPrice: 5200,
      discountBadge: '44% OFF',
      rating: 4.8,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      description: 'Abrigo tres cuartos de alta densidad térmica, ideal para clima frío y eventos formales.',
      specs: { 'Material': '90% Lana Melton, 10% Poliamida', 'Largo': 'Bajo la rodilla', 'Bolsillos': 'Interiores térmicos' }
    },
    {
      id: 6,
      name: 'Chamarra Cazadora Bomber Gamuza',
      category: 'Abrigos',
      price: 1980,
      originalPrice: 3400,
      discountBadge: '41% OFF',
      rating: 4.7,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      description: 'Acabado en gamuza suave con cuello y puños acanalados elásticos.',
      specs: { 'Material': 'Piel Nobuk Sintética Premium', 'Cierre': 'Cremallera frontal doble', 'Color': 'Oliva Seco' }
    },

    // --- CAMISAS & TEJIDOS ---
    {
      id: 7,
      name: 'Camisa Guayabera Lino Puro',
      category: 'Camisas',
      price: 780,
      originalPrice: 1300,
      discountBadge: '40% OFF',
      rating: 4.6,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      description: 'Lino fresco y transpirable con botones de madera natural y cuello tipo resort.',
      specs: { 'Material': '100% Lino Orgánico', 'Corte': 'Regular Fit', 'Cuidado': 'Lavado en frío' }
    },
    {
      id: 8,
      name: 'Suéter de Cuello Alto Cachemira',
      category: 'Camisas',
      price: 1120,
      originalPrice: 1950,
      discountBadge: '42% OFF',
      rating: 4.8,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      description: 'Punto fino ultrasuave de cuello tortuga, ideal para vestir bajo sacos y sobretodos.',
      specs: { 'Material': '50% Cachemira, 50% Algodón Pima', 'Grosor': 'Punto fino (12 Gauge)', 'Color': 'Crudo Arena' }
    },
    {
      id: 9,
      name: 'Camisa Denim Lavado Japonés',
      category: 'Camisas',
      price: 890,
      originalPrice: 1450,
      discountBadge: '38% OFF',
      rating: 4.5,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      description: 'Tejido vaquero resistente con costuras reforzadas en tono ocre y botones nacarados.',
      specs: { 'Material': '100% Algodón Selvedge', 'Gramaje': '7 oz', 'Corte': 'Slim Fit' }
    },

    // --- PANTALONES ---
    {
      id: 10,
      name: 'Pantalón Chino Tapered Fit',
      category: 'Pantalones',
      price: 620,
      originalPrice: 990,
      discountBadge: '37% OFF',
      rating: 4.5,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      description: 'Algodón elástico de alta densidad para máxima comodidad y versatilidad diaria.',
      specs: { 'Material': '98% Algodón, 2% Elastano', 'Tiro': 'Medio', 'Color': 'Beige Arena' }
    },
    {
      id: 11,
      name: 'Pantalón de Vestir Plisado Gris',
      category: 'Pantalones',
      price: 940,
      originalPrice: 1600,
      discountBadge: '41% OFF',
      rating: 4.7,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
      description: 'Doble pinza frontal con ajustadores laterales de hebilla metálica (side adjusters).',
      specs: { 'Material': '60% Lana, 40% Viscosa', 'Corte': 'Relaxed Tapered', 'Tiro': 'Alto' }
    },
    {
      id: 12,
      name: 'Pantalón Cargo Sartorial Espresso',
      category: 'Pantalones',
      price: 850,
      originalPrice: 1390,
      discountBadge: '38% OFF',
      rating: 4.6,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      description: 'Bolsillos laterales planos con fuelles discretos para un acabado limpio.',
      specs: { 'Material': '100% Algodón Ripstop', 'Color': 'Café Espresso', 'Ajuste': 'Cintura elástica trasera' }
    },

    // --- CALZADO ---
    {
      id: 13,
      name: 'Botines Chelsea Gamuza Tabaco',
      category: 'Calzado',
      price: 1650,
      originalPrice: 2750,
      discountBadge: '40% OFF',
      rating: 4.7,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      description: 'Construcción Goodyear welted con elásticos laterales y suela antideslizante.',
      specs: { 'Corte': 'Piel Nobuk / Gamuza', 'Suela': 'Goma vulcanizada', 'Tallas': '26 - 29 MX' }
    },
    {
      id: 14,
      name: 'Mocasines Penny Loafers Cuero Burdeos',
      category: 'Calzado',
      price: 1790,
      originalPrice: 3100,
      discountBadge: '42% OFF',
      rating: 4.9,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      description: 'Piel con brillo pulido a mano, costuras decorativas y plantilla acolchada ergonómica.',
      specs: { 'Material': 'Piel Flor de Ternera', 'Suela': 'Cuero curtido vegetal', 'Color': 'Burdeos Oxblood' }
    },
    {
      id: 15,
      name: 'Sneakers Minimalistas Piel Blanca',
      category: 'Calzado',
      price: 1250,
      originalPrice: 2100,
      discountBadge: '40% OFF',
      rating: 4.6,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      description: 'Tenis de perfil bajo sin logotipos visibles, diseñados para combinar con trajes o jeans.',
      specs: { 'Corte': '100% Piel Nappa', 'Forro': 'Cuero microperforado', 'Suela': 'Caucho cosido Margom' }
    },

    // --- ACCESORIOS & MARROQUINERÍA ---
    {
      id: 16,
      name: 'Reloj Cronógrafo Cuarzo Acero',
      category: 'Accesorios',
      price: 1299,
      originalPrice: 2199,
      discountBadge: '41% OFF',
      rating: 4.9,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      description: 'Caja de 42mm en acero inoxidable quirúrgico con correa de cuero italiano intercambiable.',
      specs: { 'Resistencia': '5 ATM', 'Cristal': 'Mineral endurecido', 'Movimiento': 'Cuarzo Japonés' }
    },
    {
      id: 17,
      name: 'Maletín Weekender Cuero Vintage',
      category: 'Accesorios',
      price: 2100,
      originalPrice: 3600,
      discountBadge: '41% OFF',
      rating: 4.8,
      stock: 2,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      description: 'Bolso de viaje con compartimento acolchado para laptop y correa de hombro ajustable.',
      specs: { 'Material': 'Piel Crazy Horse encerada', 'Capacidad': '35 Litros', 'Herrajes': 'Latón envejecido' }
    },
    {
      id: 18,
      name: 'Gafas de Sol Acetato Carey Polarizadas',
      category: 'Accesorios',
      price: 690,
      originalPrice: 1200,
      discountBadge: '42% OFF',
      rating: 4.7,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      description: 'Montura de acetato pulido a mano con bisagras de 5 dientes y micas verdes UV400.',
      specs: { 'Protección': '100% UV400 / Polarizadas', 'Material': 'Acetato de celulosa', 'Acabado': 'Havana Carey' }
    }
  ]);

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id);
  }
}