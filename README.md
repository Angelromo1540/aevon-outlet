# AEVON | Men's Archive Outlet (E-Commerce Web App)

Plataforma de comercio electrónico orientada a prendas masculinas de archivo y sastrería de alta gama. Desarrollada con Angular bajo una arquitectura basada en componentes independientes (Standalone) y reactividad mediante Signals.

## Tecnologías Utilizadas
- **Framework:** Angular (Standalone Components, Signals, Computed properties)
- **Estilos:** Bootstrap 5, Vanilla CSS personalizado con Glassmorphism y CSS Custom Properties
- **Iconografía & Tipografía:** Bootstrap Icons, Playfair Display & Plus Jakarta Sans
- **Almacenamiento Local:** Web Storage API (`localStorage`) para persistencia de sesión, carrito y favoritos

## Funcionalidades Principales
- **Catálogo Reactivo:** Búsqueda predictiva, filtrado dinámico por categorías, ordenamiento y control de precio máximo.
- **Quick-View Modal:** Vista rápida con selección de tallas y control de inventario reactivo.
- **Offcanvas Cart & Wishlist:** Bolsa lateral deslizante y lista de deseos interactiva con notificaciones Toast.
- **Checkout Multistep:** Validación de envío por Código Postal, métodos de pago simulados y soporte de cupones (`PROFE100`).
- **Diseño Editorial Adaptativo:** Modo Claro (Arena Sartorial) y Modo Oscuro (Carbón Profundo).
- **Floating Action Bar:** Barra de acceso rápido emergente sincronizada con el scroll.
- **Reset Data Utility:** Herramienta en pie de página para restablecer el entorno a datos de prueba iniciales.

## Instalación y Ejecución Local
```bash
git clone <https://github.com/Angelromo1540/aevon-outlet.git>
cd aevon-outlet
npm install
ng serve -o