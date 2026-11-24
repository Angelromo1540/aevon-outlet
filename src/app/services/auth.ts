import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { User } from 'firebase/auth';
import { apiBaseUrl, firebaseStoreEnabled } from '../catalog-mode';
import { FirebaseStore } from './firebase-store';

export interface SessionUser {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private firebaseStore = inject(FirebaseStore);
  private token = '';
  readonly api = apiBaseUrl ?? '';
  readonly firebase = firebaseStoreEnabled;
  readonly serverConfigured = this.firebase || apiBaseUrl !== null;
  readonly checkingSession = signal(this.firebase);
  readonly currentUser = signal<SessionUser | null>(null);

  constructor() {
    localStorage.removeItem('registered_users');
    localStorage.removeItem('auth_user');
    if (this.firebase) {
      void this.firebaseStore.watchUser(user => {
        this.setFirebaseUser(user);
        this.checkingSession.set(false);
      }).catch(() => this.checkingSession.set(false));
    }
  }

  headers() {
    return new HttpHeaders({ Authorization: 'Bearer ' + this.token });
  }

  async login(email: string, password: string) {
    if (this.firebase) {
      this.setFirebaseUser(await this.firebaseStore.login(email, password));
      return;
    }
    await this.authenticate('login', { email, password });
  }

  async register(name: string, email: string, password: string) {
    if (this.firebase) {
      if (!name.trim()) throw new Error('Escribe el nombre para tu cuenta de prueba.');
      if (password.length < 8) throw new Error('Usa una contraseña de al menos 8 caracteres.');
      this.setFirebaseUser(await this.firebaseStore.register(name, email, password));
      return;
    }
    await this.authenticate('register', { name, email, password });
  }

  async logout() {
    if (this.firebase) {
      await this.firebaseStore.logout();
      this.currentUser.set(null);
      return;
    }
    const headers = this.headers();
    this.token = '';
    this.currentUser.set(null);
    if (this.serverConfigured) {
      this.http.post(`${this.api}/auth/logout`, {}, { headers }).subscribe({ error: () => {} });
    }
  }

  private setFirebaseUser(user: User | null) {
    this.currentUser.set(user ? {
      id: user.uid,
      name: user.displayName || 'Cuenta AEVON',
      email: user.email ?? '',
      role: 'Cliente'
    } : null);
  }

  private async authenticate(path: string, body: object) {
    if (!this.serverConfigured) throw new Error('El servidor de cuentas no está disponible.');
    const result = await firstValueFrom(this.http.post<{ token: string; user: SessionUser }>(
      `${this.api}/auth/${path}`, body
    ));
    this.token = result.token;
    this.currentUser.set(result.user);
  }
}
