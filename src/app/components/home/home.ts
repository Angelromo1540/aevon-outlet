import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ModalService } from '../../services/modal.service';
import { Product } from '../../models/shop.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  productService = inject(ProductService);
  cartService = inject(CartService);
  modalService = inject(ModalService);

  searchTerm = signal('');
  selectedCategory = signal('Todas');
  maxPrice = signal(5000);
  sortBy = signal<'default' | 'price-asc' | 'price-desc'>('default');

  get categories(): string[] { return ['Todas', ...new Set(this.productService.getProducts()().map(p => p.category))]; }

  filteredProducts = computed(() => {
    let list = this.productService.getProducts()();
    if (this.searchTerm().trim()) {
      const term = this.searchTerm().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    }
    if (this.selectedCategory() !== 'Todas') {
      list = list.filter(p => p.category === this.selectedCategory());
    }
    list = list.filter(p => p.price <= this.maxPrice());
    if (this.sortBy() === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (this.sortBy() === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  });

  isWishlisted(id: number): boolean {
    return this.cartService.wishlist().includes(id);
  }

  openProductModal(product: Product) {
    this.modalService.open(product);
  }

  toggleWish(id: number) {
    this.cartService.toggleWishlist(id);
  }
}