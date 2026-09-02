import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/shop.models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  selectedSize = signal<string>('M');
  quantity = signal<number>(1);
  addedToast = signal<boolean>(false);

  availableSizes = ['CH (36)', 'M (38)', 'G (40)', 'XG (42)'];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product.set(this.productService.getProductById(id));
    });
  }

  changeQty(amount: number) {
    const current = this.quantity();
    const prod = this.product();
    if (!prod) return;

    const next = current + amount;
    if (next >= 1 && next <= prod.stock) {
      this.quantity.set(next);
    }
  }

  addToCart() {
    const prod = this.product();
    if (!prod) return;

    this.cartService.addToCart(prod, this.quantity(), this.selectedSize());
    this.addedToast.set(true);
    setTimeout(() => this.addedToast.set(false), 3000);
  }

  getSpecsList() {
    const specs = this.product()?.specs;
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }
}