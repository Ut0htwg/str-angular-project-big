import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../../model/customer';
import { Order } from '../../model/order';
import { CustomerService } from '../../service/customer.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
})
export class EditCustomerComponent implements OnInit {
  customer: Customer = new Customer();
  updating: boolean = false;

  chosenOrder: Order = new Order();

  entityName: string = 'order';
  list$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {

  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      switchMap((txt) => this.like('id', txt))
    );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.customerService.get(params.id).subscribe((customer) => {
        console.log(customer);
        this.customer = customer || new Customer();
        this.customer.active = this.customer.id ? this.customer.active : true;
      })
    );
    this.chosenOrder.id = this.customer.orderID;
  }

  orderResultFormatter(order: Order): string {
    return `${order.id}`;
  }

  orderInputFormatter(order: Order): string {
    if (!order.id) {
      return '';
    }
    return `(${order.id})`;
  }

  like(key: string, value: string, limit: number = 10): Observable<Order[]> {
    key = `${key}_like`;
    const query = `${this.customerService.customerApiUrl}/${this.entityName}?${key}=${value}&_limit=${limit}`;
    return this.http.get<Order[]>(query);
  }

  onFormSubmit(form: NgForm): void {
    this.updating = true;
    this.customerService
      .update(this.customer)
      .subscribe(() => this.router.navigate(['customers']));
  }


  setCustomerToDatabase(customer: Customer): void {
    this.updating = true;
    customer.id = Number(customer.id);
    if (customer.id === 0) {
      this.customerService.create(customer).subscribe(
        () => {
          this.toastr.success('You have successfully added a customer.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['customers']);
        },
        (error) =>
          this.toastr.error('There has been an error. The customer is not added.', 'Error!', {
            timeOut: 3000,
          })
      );
    } else {
      this.customerService.update(customer).subscribe(
        () => {
          this.toastr.success('You have successfully updated the customer.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['customers']);
        },
        (error) =>
          this.toastr.error('There has been an error. The customer is not updated.', 'Error!', {
            timeOut: 3000,
          })
      );
    }
  }
}