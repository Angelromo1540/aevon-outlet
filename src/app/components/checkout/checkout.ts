import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  cartService = inject(CartService);

  step = signal<1 | 2 | 3>(1);

  // Formulario de Envío
  fullName = signal('');
  address = signal('');
  postalCode = signal('');
  city = signal('');
  state = signal('');
  shippingCost = signal<number>(0);
  shippingCalculated = signal(false);

  // Método de Pago
  paymentMethod = signal<'card' | 'oxxo' | 'spei'>('card');
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');

  // Simulación de Proceso
  isProcessing = signal(false);
  orderNumber = signal('');

  // Cupones
  couponInput = signal('');
  couponMsg = signal('');

  totalFinal = computed(() => {
    const subtotal = this.cartService.getSubtotal();
    const discount = this.cartService.getDiscount();
    return subtotal - discount + this.shippingCost();
  });

  calculateShipping() {
    const cp = this.postalCode().trim();
    if (cp.length === 5 && !isNaN(Number(cp))) {
      // Envío gratis si el subtotal supera $1500, o $120 tarifa estándar
      this.shippingCost.set(this.cartService.getSubtotal() >= 1500 ? 0 : 120);
      this.shippingCalculated.set(true);
    }
  }

  applyCoupon() {
    const ok = this.cartService.applyCoupon(this.couponInput());
    this.couponMsg.set(ok ? 'Cupón del 15% aplicado con éxito.' : 'Cupón inválido (usa PROFE100).');
  }

  nextStep() {
    if (this.step() === 1) {
      if (!this.fullName() || !this.address() || !this.postalCode()) {
        alert('Por favor completa los datos de envío.');
        return;
      }
      this.step.set(2);
    } else if (this.step() === 2) {
      this.isProcessing.set(true);
      setTimeout(() => {
        this.isProcessing.set(false);
        this.orderNumber.set('AEV-' + Math.floor(100000 + Math.random() * 900000));
        this.step.set(3);
        // Vaciar carrito tras orden completada
        localStorage.removeItem('cart_items');
        this.cartService.cart.set([]);
      }, 2000);
    }
  }
}