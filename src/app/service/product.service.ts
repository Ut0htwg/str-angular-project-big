import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = 'http://localhost:3000/products';

  list$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.getAll();
  }

  getAll(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(
      product => this.list$.next(product)
    );
  }

  get(id: number): Observable<Product> {
    id = typeof id === 'string' ? parseInt(id, 10) : id;
    const product: Product | undefined = this.list$.value.find(item => item.id === id);
    if (product) {
      return of(product);
    }
    return of(new Product());
  }

  update(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  create(product: Product): void {
    this.http.post<Product>(`${this.apiUrl}`, product).subscribe(
      () => this.getAll()
    );
  }

  remove(product: Product): void {
    this.http.delete<Product>(`${this.apiUrl}/${product.id}`).subscribe(
      () => this.getAll()
    );
  }
}
