import { Component, inject, signal, computed } from '@angular/core';
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

  selectedSize = signal<string>('');
  quantity = signal<number>(1);
  addedToast = signal<boolean>(false);

  availableSizes = computed(() => (this.modalService.selectedProduct()?.variants ?? []).filter(v => v.stock > 0).map(v => v.size));

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

    const size = this.selectedSize();
    if (!size || !this.availableSizes().includes(size)) { alert('Selecciona una talla disponible.'); return; }
    this.cartService.addToCart(prod, this.quantity(), size);
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