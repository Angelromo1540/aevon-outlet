import { Injectable, signal } from '@angular/core';
import { User } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(this.loadUser());

  private loadUser(): User | null {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  }

  login(email: string, pass: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
      this.currentUser.set({ name: user.name, email: user.email });
      localStorage.setItem('auth_user', JSON.stringify({ name: user.name, email: user.email }));
      return true;
    }
    return false;
  }

  register(name: string, email: string, pass: string): boolean {
    let users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (users.some(u => u.email === email)) {
      return false;
    }
    const newUser = { name, email, password: pass };
    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));
    this.currentUser.set({ name, email });
    localStorage.setItem('auth_user', JSON.stringify({ name, email }));
    return true;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
  }
}