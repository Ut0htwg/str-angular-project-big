import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../model/product';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productApiUrl: string = 'http://localhost:3000/products';

  list$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(
    private http: HttpClient,
  ) { }

  getAll(): void {
    this.http.get<Product[]>(this.productApiUrl).subscribe(
      products => this.list$.next(products)
    );
  }

  get(id: number | string): Observable<Product> {
    id = parseInt(('' + id), 10);
    return this.http.get<Product>(`${this.productApiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productApiUrl, product);
  }

  update(product: Product): Observable<Product> {
    return this.http
      .patch<Product>(`${this.productApiUrl}/${product.id}`, product)
      .pipe(tap(() => this.getAll()));

  }

  remove(id: number | string): void {
    id = parseInt(('' + id), 10);
    this.http.delete<Product>(`${this.productApiUrl}/${id}`).subscribe(
      () => this.getAll()
    );
  }

}