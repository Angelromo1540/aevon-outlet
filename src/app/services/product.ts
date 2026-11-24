import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:3000/api/products';

  private products = signal<Product[]>([]);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {

    if (this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.get<Product[]>(this.apiUrl).subscribe({

      next: (data) => {
        this.products.set(data);
        this.loading.set(false);

        console.log('Productos cargados desde SQL Server:', data.length);
      },

      error: (err) => {
        console.error('Error al cargar productos:', err);

        this.error.set(
          'No se pudo establecer conexión con el servidor.'
        );

        this.loading.set(false);
      }

    });
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id);
  }

}