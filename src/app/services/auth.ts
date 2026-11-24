import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { apiBaseUrl, exhibitionMode } from '../catalog-mode';
export interface SessionUser { id: number; name: string; email: string; role: string; }
@Injectable({providedIn:'root'})
export class AuthService {
  private http=inject(HttpClient);
  readonly api=apiBaseUrl ?? '';
  readonly serverConfigured = !exhibitionMode;
  private token='';
  currentUser=signal<SessionUser|null>(null);
  constructor(){ localStorage.removeItem('registered_users'); localStorage.removeItem('auth_user'); }
  headers(){ return new HttpHeaders({Authorization:'Bearer '+this.token}); }
  async login(email:string,password:string){ await this.authenticate('login',{email,password}); }
  async register(name:string,email:string,password:string){ await this.authenticate('register',{name,email,password}); }
  private async authenticate(path:string,body:object){
    if (!this.serverConfigured) throw new Error('El servidor de cuentas no está disponible.');
    const r=await firstValueFrom(this.http.post<{token:string,user:SessionUser}>(`${this.api}/auth/${path}`,body));
    this.token=r.token;
    this.currentUser.set(r.user);
  }
  logout(){ const headers=this.headers(); this.token=''; this.currentUser.set(null); if (this.serverConfigured) this.http.post(`${this.api}/auth/logout`,{},{headers}).subscribe({error:()=>{}}); }
}
