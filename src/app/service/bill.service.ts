import { Injectable } from '@angular/core';
import { Bill } from '../model/bill';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  billApiUrl: string = 'http://localhost:3000/bills';

  list$: BehaviorSubject<Bill[]> = new BehaviorSubject<Bill[]>([]);

  constructor(
    private http: HttpClient,
  ) { }

  getAll(): void {
    this.http.get<Bill[]>(this.billApiUrl).subscribe(bills => this.list$.next(bills));
  }

  get(id: number | string): Observable<Bill> {
    id = parseInt(('' + id), 10);
    return this.http.get<Bill>(`${this.billApiUrl}/${id}`);
  }

  update(bill: Bill): Observable<Bill> {
    return this.http
      .patch<Bill>(`${this.billApiUrl}/${bill.id}`, bill)
      .pipe(tap(() => this.getAll()));
  }

  create(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.billApiUrl, bill);
  }

  remove(id: number | string): void {
    id = parseInt(('' + id), 10);
    this.http.delete<Bill>(`${this.billApiUrl}/${id}`).subscribe(
      () => this.getAll()
    );
  }
}