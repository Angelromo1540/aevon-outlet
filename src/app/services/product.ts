import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/shop.models';
import { apiBaseUrl, exhibitionMode } from '../catalog-mode';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  readonly exhibitionMode = exhibitionMode;
  private readonly catalogUrl = apiBaseUrl === null
    ? 'catalogo-exhibicion.json'
    : `${apiBaseUrl}/products`;

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

    this.http.get<Product[]>(this.catalogUrl).subscribe({

      next: (data) => {
        if (Array.isArray(data)) {
          this.products.set(data);
        } else {
          this.error.set('El servidor devolvió un catálogo con formato inválido.');
        }
        this.loading.set(false);

      },

      error: (err) => {
        console.error('Error al cargar productos:', err);

        this.error.set(
          exhibitionMode
            ? 'No se pudo cargar el catálogo de exhibición.'
            : 'No se pudo cargar el catálogo desde el servidor.'
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
