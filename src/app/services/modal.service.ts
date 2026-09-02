import { Injectable, signal } from '@angular/core';
import { Product } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  selectedProduct = signal<Product | null>(null);
  isOpen = signal<boolean>(false);

  open(product: Product) {
    this.selectedProduct.set(product);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }

  close() {
    this.isOpen.set(false);
    this.selectedProduct.set(null);
    document.body.style.overflow = 'auto';
  }
}