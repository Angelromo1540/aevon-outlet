import { Injectable, inject, signal } from '@angular/core';
import { CartItem, Product } from '../models/shop.models';
import { ToastService } from './toast';
import { exhibitionMode } from '../catalog-mode';

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

  availableSizes(product?: Product): string[] {
    const variants = product?.variants ?? [];
    return [...new Set(variants.filter(variant => exhibitionMode || variant.stock > 0).map(variant => variant.size))];
  }

  private canSetQuantity(product: Product, size: string | undefined, quantity: number): boolean {
    const variant = product.variants?.find(candidate => candidate.size === size);
    return !!variant && Number.isSafeInteger(quantity) && quantity > 0
      && (exhibitionMode || quantity <= variant.stock);
  }

  addToCart(product: Product, quantity = 1, size?: string): boolean {
    if (!size) {
      this.toastService.show('Selecciona la talla desde el catálogo', 'info');
      return false;
    }
    const current = [...this.cart()];
    const index = current.findIndex(item => item.product.id === product.id && item.selectedSize === size);
    const totalQuantity = (current[index]?.quantity ?? 0) + quantity;
    if (!Number.isSafeInteger(quantity) || quantity < 1 || !this.canSetQuantity(product, size, totalQuantity)) {
      this.toastService.show('Talla o cantidad no disponible', 'danger');
      return false;
    }
    if (index >= 0) {
      current[index] = { product, quantity: totalQuantity, selectedSize: size };
      this.toastService.show(`Cantidad actualizada: ${product.name}`, 'info');
    } else {
      current.push({ product, quantity, selectedSize: size });
      this.toastService.show(`Agregado a la bolsa: ${product.name}`, 'success');
    }
    this.cart.set(current);
    this.saveCart();
    return true;
  }

  updateQuantity(productId: number, quantity: number, size?: string) {
    const current = [...this.cart()];
    const item = current.find(i => i.product.id === productId && i.selectedSize === size);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId, size);
    } else if (this.canSetQuantity(item.product, size, quantity)) {
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
    this.toastService.show('Abre el producto en el catálogo y selecciona una talla.', 'info');
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
