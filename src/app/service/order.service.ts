import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../model/order';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderApiUrl: string = 'http://localhost:3000/orders';

  list$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  // orderList: Observable<Order[]> = this.orderService.getAll();

  constructor(
    private http: HttpClient,
  ) { }

  getAll(): void {
    this.http.get<Order[]>(this.orderApiUrl).subscribe(
      orders => this.list$.next(orders)
    );
  }

  get(id: number | string): Observable<Order> {
    id = parseInt(('' + id), 10);
    return this.http.get<Order>(`${this.orderApiUrl}/${id}`);
  }

  // create(order: Order): void {
  //   this.http.post<Order>(this.orderApiUrl, order).subscribe(
  //     () => this.getAll()
  //   );
  // }

  // update(order: Order): void {
  //   this.http.patch<Order>(`${this.orderApiUrl}/${order.id}`, order).subscribe(
  //     () => this.getAll()
  //   );
  // }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.orderApiUrl, order);
  }

  update(order: Order): Observable<Order> {
    return this.http
      .patch<Order>(`${this.orderApiUrl}/${order.id}`, order)
      .pipe(tap(() => this.getAll()));

  }

  remove(id: number | string): void {
    id = parseInt(('' + id), 10);
    this.http.delete<Order>(`${this.orderApiUrl}/${id}`).subscribe(
      () => this.getAll()
    );
  }

}