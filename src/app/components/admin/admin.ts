import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';
@Component({selector:'app-admin',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./admin.html'})
export class Admin implements OnInit {
 auth=inject(AuthService); private http=inject(HttpClient); private products=inject(ProductService);
 tab='productos'; busy=false; message=''; catalog:any={categories:[],products:[],inventory:[],coupons:[]}; reports:any={sales:[],top:[],returns:[],clients:[],audit:[]};
 form:any=this.blank(); category:any={id:0,name:'',slug:'',active:true}; variant:any={productId:null,sku:'',size:'',color:'Sin especificar'}; adjustment:any={id:null,quantity:1,reason:''};
 reportKeys=['sales','top','returns','clients','audit']; reportLabels:Record<string,string>={sales:'Ventas por fecha de pedido',top:'Productos más vendidos (bruto)',returns:'Devoluciones',clients:'Clientes',audit:'Bitácora (100 últimos eventos)'};
 blank(){return {id:0,categoryId:null,sku:'',name:'',description:'',price:0,originalPrice:0,active:true,size:'Única',color:'Sin especificar',image:''};}
 ngOnInit(){if(this.auth.currentUser()?.role==='Administrador')void this.load();}
 async load(){try{const headers=this.auth.headers();this.catalog=await firstValueFrom(this.http.get(`${this.auth.api}/admin/catalog`,{headers}));this.reports=await firstValueFrom(this.http.get(`${this.auth.api}/admin/reports`,{headers}));}catch(e:any){this.message=e.error?.mensaje||'No se pudo consultar el panel';}}
 async save(path:string,body:any,patch=false){if(this.busy)return;this.busy=true;this.message='';try{const opts={headers:this.auth.headers()};const url=`${this.auth.api}/admin/${path}`;await firstValueFrom(patch?this.http.patch(url,body,opts):this.http.post(url,body,opts));this.message='Operación guardada correctamente';await this.load();this.products.loadProducts();}catch(e:any){this.message=e.error?.mensaje||'Operación rechazada';}finally{this.busy=false;}}
 edit(p:any){this.form={...p,active:!!p.active};}
 async saveProduct(){await this.save('products'+(this.form.id?'/'+this.form.id:''),this.form,!!this.form.id);}
 editCategory(c:any){this.category={...c,active:!!c.active};}
 async saveCategory(){await this.save('categories'+(this.category.id?'/'+this.category.id:''),this.category,!!this.category.id);}
 keys(o:any){return Object.keys(o||{});}
}
