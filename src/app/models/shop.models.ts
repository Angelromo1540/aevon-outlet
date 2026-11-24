export interface ProductVariant {
  id: number;
  sku: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: number;
  ratingIsDemo: boolean;
  stock: number;
  image: string;
  description: string;
  specs: { [key: string]: string };
  variants: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
}