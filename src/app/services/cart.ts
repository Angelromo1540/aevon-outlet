import { Injectable, inject, signal } from '@angular/core';
import { CartItem, Product } from '../models/shop.models';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private toastService = inject(ToastService);

  cart = signal<CartItem[]>(this.load('cart_items', []));
  wishlist = signal<number[]>(this.load('wishlist_items', []));
  appliedCoupon = signal<{ code: string; discountRate: number } | null>(null);

  private load<T>(key: string, fallback: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }

  private saveCart() {
    localStorage.setItem('cart_items', JSON.stringify(this.cart()));
  }

  private saveWishlist() {
    localStorage.setItem('wishlist_items', JSON.stringify(this.wishlist()));
  }

  addToCart(product: Product, quantity = 1, size?: string) {
    const current = [...this.cart()];
    const index = current.findIndex(i => i.product.id === product.id && i.selectedSize === size);

    if (index > -1) {
      const newQty = current[index].quantity + quantity;
      if (newQty <= product.stock) {
        current[index].quantity = newQty;
        this.toastService.show(`Cantidad actualizada: ${product.name}`, 'info');
      } else {
        this.toastService.show(`Stock límite alcanzado para esta prenda`, 'danger');
      }
    } else {
      if (quantity <= product.stock) {
        current.push({ product, quantity, selectedSize: size });
        this.toastService.show(`Agregado a la bolsa: ${product.name}`, 'success');
      }
    }
    this.cart.set(current);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number, size?: string) {
    let current = [...this.cart()];
    const item = current.find(i => i.product.id === productId && i.selectedSize === size);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId, size);
    } else if (quantity <= item.product.stock) {
      item.quantity = quantity;
      this.cart.set(current);
      this.saveCart();
    }
  }

  removeFromCart(productId: number, size?: string) {
    const item = this.cart().find(i => i.product.id === productId && i.selectedSize === size);
    this.cart.set(this.cart().filter(i => !(i.product.id === productId && i.selectedSize === size)));
    this.saveCart();
    if (item) {
      this.toastService.show(`Prenda removida de la bolsa`, 'info');
    }
  }

  toggleWishlist(productId: number) {
    let list = [...this.wishlist()];
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
      this.toastService.show(`Removido de favoritos`, 'info');
    } else {
      list.push(productId);
      this.toastService.show(`Guardado en favoritos`, 'success');
    }
    this.wishlist.set(list);
    this.saveWishlist();
  }

  moveToCart(product: Product) {
    this.addToCart(product, 1);
    this.toggleWishlist(product.id);
  }

  applyCoupon(code: string): boolean {
    if (code.trim().toUpperCase() === 'PROFE100') {
      this.appliedCoupon.set({ code: 'PROFE100', discountRate: 0.15 });
      this.toastService.show(`¡Cupón PROFE100 aplicado! (15% OFF)`, 'success');
      return true;
    }
    this.toastService.show(`Código de cupón no válido`, 'danger');
    return false;
  }

  getSubtotal(): number {
    return this.cart().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  getDiscount(): number {
    const coupon = this.appliedCoupon();
    return coupon ? this.getSubtotal() * coupon.discountRate : 0;
  }

  getTotalItems(): number {
    return this.cart().reduce((acc, item) => acc + item.quantity, 0);
  }
}