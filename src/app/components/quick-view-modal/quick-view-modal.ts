import { exhibitionMode } from '../../catalog-mode';
import { Component, inject, linkedSignal, computed } from '@angular/core';
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

  selectedSize = linkedSignal({ source: this.modalService.selectedProduct, computation: () => '' });
  quantity = linkedSignal({ source: this.modalService.selectedProduct, computation: () => 1 });
  availableSizes = computed(() => this.cartService.availableSizes(this.modalService.selectedProduct() ?? undefined));

  changeQty(amount: number) {
    const prod = this.modalService.selectedProduct();
    if (!prod) return;
    const next = this.quantity() + amount;
    if (Number.isSafeInteger(next) && next >= 1 && (exhibitionMode || next <= prod.stock)) {
      this.quantity.set(next);
    }
  }

  addToCart() {
    const prod = this.modalService.selectedProduct();
    if (!prod) return;

    if (this.cartService.addToCart(prod, this.quantity(), this.selectedSize())) {
      this.modalService.close();
    }
  }

  getSpecsList() {
    const specs = this.modalService.selectedProduct()?.specs;
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }
}
