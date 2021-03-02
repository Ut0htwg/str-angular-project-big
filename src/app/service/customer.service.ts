import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerApiUrl: string = 'http://localhost:3000/customers';

  list$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);


  constructor(
    private http: HttpClient,
  ) { }

  getAll(): void {
    this.http.get<Customer[]>(this.customerApiUrl).subscribe(customers => this.list$.next(customers));
  }

  get(id: number | string): Observable<Customer> {
    id = parseInt(('' + id), 10);
    return this.http.get<Customer>(`${this.customerApiUrl}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customerApiUrl, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.http
      .patch<Customer>(`${this.customerApiUrl}/${customer.id}`, customer)
      .pipe(tap(() => this.getAll()));
  }

  remove(id: number | string): void {
    id = parseInt(('' + id), 10);
    this.http.delete<Customer>(`${this.customerApiUrl}/${id}`).subscribe(
      () => this.getAll()
    );
  }
}
