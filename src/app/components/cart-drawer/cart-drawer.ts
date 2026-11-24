import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { exhibitionMode } from '../../catalog-mode';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css'
})
export class CartDrawer {
  readonly exhibitionMode = exhibitionMode;
  cartService = inject(CartService);
  router = inject(Router);

  couponInput = signal('');
  couponError = signal(false);
  couponSuccess = signal(false);

  updateQty(productId: number, qty: number, size?: string) {
    this.cartService.updateQuantity(productId, qty, size);
  }

  removeItem(productId: number, size?: string) {
    this.cartService.removeFromCart(productId, size);
  }

  applyPromo() {
    const success = this.cartService.applyCoupon(this.couponInput());
    if (success) {
      this.couponSuccess.set(true);
      this.couponError.set(false);
    } else {
      this.couponError.set(true);
      this.couponSuccess.set(false);
    }
  }

  goToCheckout() {
    // Cerrar el offcanvas manualmente antes de navegar
    const closeBtn = document.getElementById('closeCartDrawer');
    closeBtn?.click();
    this.router.navigate(['/checkout']);
  }
}
