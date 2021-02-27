import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../model/order';
import { Customer } from '../../model/customer';
import { OrderService } from '../../service/order.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  order: Order = new Order();
  updating: boolean = false;

  chosenCustomer: Customer = new Customer();

  entityName: string = 'customer';
  list$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {

  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      switchMap((txt) => this.like('firstName', txt))
    );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.orderService.get(params.id).subscribe((order) => {
        console.log(order);
        this.order = order || new Order();
        this.order.status = this.order.id ? this.order.status : 'new';
      })
    );
    this.chosenCustomer.id = this.order.customerID;
  }

  customerResultFormatter(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`;
  }

  customerIputFormatter(customer: Customer): string {
    if (!customer.id) {
      return '';
    }
    return `(${customer.id}) ${customer.firstName} ${customer.lastName}`;
  }

  like(key: string, value: string, limit: number = 10): Observable<Customer[]> {
    key = `${key}_like`;
    const query = `${this.orderService.orderApiUrl}/${this.entityName}?${key}=${value}&_limit=${limit}`;
    return this.http.get<Customer[]>(query);
  }

  onFormSubmit(form: NgForm): void {
    this.updating = true;
    this.orderService
      .update(this.order)
      .subscribe(() => this.router.navigate(['orders']));
  }

  setOrderToDatabase(order: Order): void {
    this.updating = true;
    order.id = Number(order.id);
    if (order.id === 0) {
      this.orderService.create(order).subscribe(
        () => {
          this.toastr.success('Sikeresen létrehozott rendelés!', 'Siker!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['orders']);
        },
        (error) =>
          this.toastr.error('Hiba a rendelés létrehozásakor!', 'Hiba!', {
            timeOut: 3000,
          })
      );
    } else {
      this.orderService.update(order).subscribe(
        () => {
          this.toastr.success('Sikeresen frissítetted a rendelést!', 'Siker!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['orders']);
        },
        (error) =>
          this.toastr.error('Hiba történt a rendelés frissítésekor!', 'Hiba!', {
            timeOut: 3000,
          })
      );
    }
  }


}