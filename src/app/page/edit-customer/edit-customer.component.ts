import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../../model/customer';
import { CustomerService } from '../../service/customer.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  customer: Customer = new Customer();
  updating: boolean = false;

  chosenCustomer: Customer = new Customer();

  entityName: string = 'customer';
  list$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);

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
      switchMap((txt) => this.like('firstName', txt))
    );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.customerService.get(params.id).subscribe((customer) => {
        console.log(customer);
        this.customer = customer || new Customer();
        this.customer.active = this.customer.id ? this.customer.active : 'new';
      })
    );
    this.chosenCustomer.id = this.customer.id;
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
    const query = `${this.customerService.customerapiUrl}/${this.entityName}?${key}=${value}&_limit=${limit}`;
    return this.http.get<Customer[]>(query);
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
          this.toastr.success('You have successfully added a customer.', 'Siker!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['customers']);
        },
        (error) =>
          this.toastr.error('There has been an error. The customer is not added.', 'Hiba!', {
            timeOut: 3000,
          })
      );
    } else {
      this.customerService.update(customer).subscribe(
        () => {
          this.toastr.success('You have successfully updated the customer.', 'Siker!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['customers']);
        },
        (error) =>
          this.toastr.error('There has been an error. The customer is not updated.', 'Hiba!', {
            timeOut: 3000,
          })
      );
    }
  }
}