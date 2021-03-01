import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerapiUrl: string = 'http://localhost:3000/customers';

  list$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  

  constructor(private http: HttpClient, ) { }

  // getAll(): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(this.customerapiUrl);
  // }

  getAll(): void {
    this.http.get<Customer[]>(this.customerapiUrl).subscribe(customers => this.list$.next(customers));
  }

/*   get(customer: Customer): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerapiUrl}/${customer.id}`);
  } */

  get(id: number | string): Observable<Customer> {
    id = parseInt(("" + id), 10);
    return this.http.get<Customer>(`${this.customerapiUrl}/${id}`);
  }

/*   create(customer: Customer): void {
    this.http.post<Customer>(`${this.customerapiUrl}`, customer).subscribe(
      () => this.getAll()
    );
  } */

  // create(customer: Customer): Observable<Customer> {
  //   return this.http.post<Customer>(this.customerapiUrl, customer);
  // }

  create(customer: Customer): Observable<Customer> {
    return this.http
      .patch<Customer>(`${this.customerapiUrl}/${customer.id}`, customer)
      .pipe(tap(() => this.getAll()));
  }

/*   update(customer: Customer): Observable<Customer> {
    return this.http.patch<Customer>(`${this.customerapiUrl}/${customer.id}`, customer);
  } */
  
  update(customer: Customer): Observable<Customer> {
    return this.http
      .patch<Customer>(`${this.customerapiUrl}/${customer.id}`, customer)
      .pipe(tap(() => this.getAll()));

  }

/*   remove(customer: Customer): Observable<Customer> {
    return this.http.delete<Customer>(`${this.customerapiUrl}/${customer.id}`);
  } */

  remove(id: number | string): void {
    id = parseInt(("" + id), 10);
    this.http.delete<Customer>(`${this.customerapiUrl}/${id}`).subscribe(
      () => this.getAll()
    );
  }
}
