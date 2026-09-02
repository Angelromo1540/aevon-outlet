import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';
import { ThemeService } from '../../services/theme';
import { Product } from '../../models/shop.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  cartService = inject(CartService);
  productService = inject(ProductService);
  themeService = inject(ThemeService);

  wishlistProducts = computed(() => {
    const ids = this.cartService.wishlist();
    const all = this.productService.getProducts()();
    return all.filter(p => ids.includes(p.id));
  });

  moveToBag(product: Product) {
    this.cartService.moveToCart(product);
  }
}