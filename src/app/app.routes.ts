import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductDetail } from './components/product-detail/product-detail';
import { Checkout } from './components/checkout/checkout';
import { Auth } from './components/auth/auth';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'producto/:id', component: ProductDetail },
  { path: 'checkout', component: Checkout },
  { path: 'login', component: Auth },
  { path: '**', redirectTo: '' }
];