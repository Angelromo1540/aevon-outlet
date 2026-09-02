import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-view-modal.html',
  styleUrl: './quick-view-modal.css'
})
export class QuickViewModal {
  modalService = inject(ModalService);
  cartService = inject(CartService);

  selectedSize = signal<string>('M');
  quantity = signal<number>(1);
  addedToast = signal<boolean>(false);

  availableSizes = ['CH (36)', 'M (38)', 'G (40)', 'XG (42)'];

  changeQty(amount: number) {
    const prod = this.modalService.selectedProduct();
    if (!prod) return;
    const next = this.quantity() + amount;
    if (next >= 1 && next <= prod.stock) {
      this.quantity.set(next);
    }
  }

  addToCart() {
    const prod = this.modalService.selectedProduct();
    if (!prod) return;

    this.cartService.addToCart(prod, this.quantity(), this.selectedSize());
    this.addedToast.set(true);
    setTimeout(() => {
      this.addedToast.set(false);
      this.modalService.close();
    }, 1200);
  }

  getSpecsList() {
    const specs = this.modalService.selectedProduct()?.specs;
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }
}