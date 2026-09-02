import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  authService = inject(AuthService);
  router = inject(Router);

  isLoginMode = signal(true);
  name = signal('');
  email = signal('');
  password = signal('');
  errorMessage = signal('');

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.errorMessage.set('');
  }

  onSubmit() {
    this.errorMessage.set('');
    if (!this.email() || !this.password() || (!this.isLoginMode() && !this.name())) {
      this.errorMessage.set('Por favor completa todos los campos requeridos.');
      return;
    }

    if (this.isLoginMode()) {
      const ok = this.authService.login(this.email(), this.password());
      if (ok) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Credenciales incorrectas o usuario no registrado.');
      }
    } else {
      const ok = this.authService.register(this.name(), this.email(), this.password());
      if (ok) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Este correo electrónico ya se encuentra registrado.');
      }
    }
  }
}