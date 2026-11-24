import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';
import { FirebaseStore } from '../../services/firebase-store';
interface Receipt {folio:string;subtotal:number;discount:number;shipping:number;total:number;}
@Component({selector:'app-checkout',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./checkout.html',styleUrl:'./checkout.css'})
export class Checkout {
 cartService=inject(CartService); authService=inject(AuthService); private http=inject(HttpClient); private products=inject(ProductService);
 private firebaseStore = inject(FirebaseStore);
 step=signal<1|2|3>(1); fullName=signal(''); address=signal(''); number=signal(''); colony=signal(''); postalCode=signal(''); city=signal(''); state=signal('');
 shippingCost=signal(0); shippingCalculated=signal(false); paymentMethod=signal<'card'|'oxxo'|'spei'>('card'); isProcessing=signal(false); orderNumber=signal(''); terms=signal(false); error=signal(''); receipt=signal<Receipt|null>(null); couponInput=signal('');couponMsg=signal(''); private key=crypto.randomUUID();
 totalFinal=computed(()=>this.receipt()?.total??(this.cartService.getSubtotal()-this.cartService.getDiscount()+this.shippingCost()));
 async placeFirebaseOrder() {
   if (!this.authService.firebase || !this.authService.currentUser() || this.isProcessing() || this.orderNumber()) return;
   const cart = this.cartService.cart();
   const items: Record<string, number> = {};
   const folio = this.key;
   this.error.set('');
   if (!cart.length || !this.terms()) return;
   for (const item of cart) {
     const product = this.products.getProductById(item.product.id);
     const variant = product?.variants.find(candidate => candidate.size === item.selectedSize);
     if (!variant || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
       this.error.set('Revisa las tallas y cantidades de tu bolsa antes de confirmar.');
       return;
     }
     items[variant.id] = item.quantity;
   }
   const subtotal = this.cartService.getSubtotal();
   this.isProcessing.set(true);
   try {
     await this.firebaseStore.placeOrder(folio, items);
     this.receipt.set({ folio, subtotal, total: subtotal, discount: 0, shipping: 0 });
     this.orderNumber.set(folio);
     if (this.cartService.cart() === cart) {
       localStorage.removeItem('cart_items');
       this.cartService.cart.set([]);
     }
   } catch {
     this.error.set('No se pudo confirmar el pedido de prueba. Reintenta desde esta página.');
   } finally {
     this.isProcessing.set(false);
   }
 }
 calculateShipping(){const ok=/^\d{5}$/.test(this.postalCode());this.shippingCalculated.set(ok);this.shippingCost.set(ok&&this.cartService.getSubtotal()<1500?120:0);}
 applyCoupon(){const ok=this.cartService.applyCoupon(this.couponInput());if(!ok)this.cartService.appliedCoupon.set(null);this.couponMsg.set(ok?'Cupón del 15% aplicado.':'Cupón inválido.');}
 async nextStep(){this.error.set('');if(this.isProcessing())return;if(!this.authService.currentUser()){this.error.set('Inicia sesión en Mi Cuenta antes de comprar.');return;}if(!this.cartService.cart().length){this.error.set('Tu bolsa está vacía.');return;}if(this.step()===1){if(![this.fullName(),this.address(),this.number(),this.colony(),this.city(),this.state()].every(x=>x.trim())||!/^\d{5}$/.test(this.postalCode())){this.error.set('Completa todos los datos de envío.');return;}this.calculateShipping();this.step.set(2);return;}if(!this.terms()){this.error.set('Acepta las condiciones de la compra de prueba.');return;}const items=this.cartService.cart().map(i=>({id:i.product.variants?.find(v=>v.size===i.selectedSize)?.id,quantity:i.quantity}));if(items.some(i=>!i.id)){this.error.set('Vacía la bolsa anterior y agrega las prendas eligiendo una talla disponible.');return;}this.isProcessing.set(true);try{const r=await firstValueFrom(this.http.post<Receipt>(`${this.authService.api}/orders`,{key:this.key,items,terms:true,payment:'APPROVED',method:this.paymentMethod(),coupon:this.cartService.appliedCoupon()?.code,expected:this.totalFinal(),address:{name:this.fullName(),street:this.address(),number:this.number(),colony:this.colony(),city:this.city(),state:this.state(),cp:this.postalCode()}},{headers:this.authService.headers()}));this.receipt.set(r);this.orderNumber.set(r.folio);this.step.set(3);localStorage.removeItem('cart_items');this.cartService.cart.set([]);this.cartService.appliedCoupon.set(null);this.products.loadProducts();}catch(e:any){this.error.set(e.error?.mensaje||'No se pudo confirmar el pedido. Reintenta sin recargar.');}finally{this.isProcessing.set(false);}}
}
