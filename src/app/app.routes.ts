import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductDetail } from './components/product-detail/product-detail';
import { Checkout } from './components/checkout/checkout';
import { Auth } from './components/auth/auth';

import { Admin } from './components/admin/admin';
import { Legal } from './components/legal/legal';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'producto/:id', component: ProductDetail },
  { path: 'checkout', component: Checkout },
  { path: 'login', component: Auth },
  { path: 'admin', component: Admin },
  { path: 'legal', component: Legal },
  { path: '**', redirectTo: '' }
];