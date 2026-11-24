import { exhibitionMode } from '../../catalog-mode';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  readonly exhibitionMode = exhibitionMode;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);

  private productId = signal(0);
  product = computed(() => this.productService.getProductById(this.productId()));
  selectedSize = signal<string>('');
  quantity = signal<number>(1);
  addedToast = signal<boolean>(false);

  availableSizes = computed(() => this.cartService.availableSizes(this.product()));

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productId.set(id); this.selectedSize.set(''); this.quantity.set(1);
    });
  }

  changeQty(amount: number) {
    const current = this.quantity();
    const prod = this.product();
    if (!prod) return;

    const next = current + amount;
    if (Number.isSafeInteger(next) && next >= 1 && (exhibitionMode || next <= prod.stock)) {
      this.quantity.set(next);
    }
  }

  addToCart() {
    const prod = this.product();
    if (!prod) return;

    if (!this.cartService.addToCart(prod, this.quantity(), this.selectedSize())) return;
    this.addedToast.set(true);
    setTimeout(() => this.addedToast.set(false), 3000);
  }

  getSpecsList() {
    const specs = this.product()?.specs;
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }
}
