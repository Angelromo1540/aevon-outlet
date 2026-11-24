import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth';
interface Order {id:number;folio:string;estado:string;total:number;fecha:string;cliente?:string;}
interface ReturnRequest {id:number;folio:string;pedidoId:number;pedido:string;tipo:string;motivo:string;descripcion:string;estado:string;resolucion?:string;comentario?:string;}
@Component({selector:'app-auth',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./auth.html',styleUrl:'./auth.css'})
export class Auth {
 authService=inject(AuthService); private http=inject(HttpClient);
 isLoginMode=signal(true); name=signal(''); email=signal(''); password=signal(''); errorMessage=signal(''); busy=signal(false); orders=signal<Order[]>([]);
 returns=signal<ReturnRequest[]>([]); requestOrder=signal<Order|null>(null); returnType=signal(''); returnReason=signal('OTRO'); returnDescription=signal(''); resolutionId=signal<number|null>(null); resolutionComment=signal(''); received=signal(false); restock=signal(false);
 constructor(){effect(()=>{if(this.authService.currentUser()) {void this.loadOrders();void this.loadReturns();} else {this.orders.set([]);this.returns.set([]);this.requestOrder.set(null);this.resolutionId.set(null);}});}
 toggleMode(){this.isLoginMode.update(v=>!v);this.errorMessage.set('');}
 async onSubmit(){ if(this.busy())return;this.busy.set(true);this.errorMessage.set('');try{if(this.isLoginMode())await this.authService.login(this.email(),this.password());else await this.authService.register(this.name(),this.email(),this.password());this.password.set('');}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudo iniciar sesión');}finally{this.busy.set(false);}}
 async loadOrders(){try{const path=this.authService.currentUser()?.role==='Administrador'?'admin/orders':'orders';this.orders.set(await firstValueFrom(this.http.get<Order[]>(`${this.authService.api}/${path}`,{headers:this.authService.headers()})));}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudieron consultar los pedidos');}}
 next(o:Order){return ({PAGADO:'PREPARANDO',PREPARANDO:'ENVIADO',ENVIADO:'ENTREGADO'} as Record<string,string>)[o.estado];}
 async advance(o:Order){if(this.busy())return;this.busy.set(true);try{await firstValueFrom(this.http.patch(`${this.authService.api}/admin/orders/${o.id}`,{estado:this.next(o)},{headers:this.authService.headers()}));await this.loadOrders();}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudo actualizar');}finally{this.busy.set(false);}}
 async loadReturns(){try{const path=this.authService.currentUser()?.role==='Administrador'?'admin/returns':'returns';this.returns.set(await firstValueFrom(this.http.get<ReturnRequest[]>(`${this.authService.api}/${path}`,{headers:this.authService.headers()})));}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudieron consultar solicitudes');}}
 canRequest(o:Order){return ['PAGADO','PREPARANDO','ENVIADO','ENTREGADO'].includes(o.estado)&&!this.returns().some(r=>r.pedidoId===o.id&&!['RECHAZADA','CANCELADA'].includes(r.estado));}
 openRequest(o:Order){this.requestOrder.set(o);this.returnType.set(['PAGADO','PREPARANDO'].includes(o.estado)?'CANCELACION':'DEVOLUCION');this.returnReason.set('OTRO');this.returnDescription.set('');this.errorMessage.set('');}
 async sendRequest(){const o=this.requestOrder();if(!o||this.busy())return;this.busy.set(true);this.errorMessage.set('');try{await firstValueFrom(this.http.post(`${this.authService.api}/returns`,{pedidoId:o.id,tipo:this.returnType(),motivo:this.returnReason(),descripcion:this.returnDescription()},{headers:this.authService.headers()}));this.requestOrder.set(null);await this.loadReturns();}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudo registrar la solicitud');}finally{this.busy.set(false);}}
 openResolution(r:ReturnRequest){this.resolutionId.set(r.id);this.resolutionComment.set('');this.received.set(false);this.restock.set(false);this.errorMessage.set('');}
 async resolve(r:ReturnRequest,action:string){if(this.busy())return;this.busy.set(true);this.errorMessage.set('');try{await firstValueFrom(this.http.patch(`${this.authService.api}/admin/returns/${r.id}`,{action,comentario:this.resolutionComment(),received:this.received(),restock:this.restock()},{headers:this.authService.headers()}));this.resolutionId.set(null);await this.loadOrders();await this.loadReturns();}catch(e:any){this.errorMessage.set(e.error?.mensaje||'No se pudo gestionar la solicitud');}finally{this.busy.set(false);}}
}
