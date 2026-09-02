import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { CartDrawer } from './components/cart-drawer/cart-drawer';
import { QuickViewModal } from './components/quick-view-modal/quick-view-modal';
import { ToastContainer } from './components/toast-container/toast-container';
import { CartService } from './services/cart';
import { AuthService } from './services/auth';
import { ToastService } from './services/toast';
import { ThemeService } from './services/theme';

export type InfoModalType = 'shipping' | 'terms' | 'contact' | null;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, CartDrawer, QuickViewModal, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'aevon-outlet';

  cartService = inject(CartService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  themeService = inject(ThemeService);

  activeInfoModal = signal<InfoModalType>(null);
  showFloatingActions = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Se activa tras hacer scroll más de 120px (cuando desaparece el header)
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showFloatingActions.set(scrollOffset > 120);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openInfo(type: InfoModalType) {
    this.activeInfoModal.set(type);
    document.body.style.overflow = 'hidden';
  }

  closeInfo() {
    this.activeInfoModal.set(null);
    document.body.style.overflow = 'auto';
  }

  resetApplicationData() {
    localStorage.clear();
    this.cartService.cart.set([]);
    this.cartService.wishlist.set([]);
    this.cartService.appliedCoupon.set(null);
    this.authService.currentUser.set(null);
    this.toastService.show('Datos restablecidos a valores de prueba.', 'info');
  }
}