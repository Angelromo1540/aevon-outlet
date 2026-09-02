export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: number;
  stock: number;
  image: string;
  description: string;
  specs: { [key: string]: string };
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