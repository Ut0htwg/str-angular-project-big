import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from '../../model/bill';
import { Order } from '../../model/order';
import { BillService } from '../../service/bill.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css'],
})
export class EditBillComponent implements OnInit {
  bill: Bill = new Bill();
  updating: boolean = false;

  chosenOrder: Order = new Order();

  entityName: string = 'order';
  list$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

  constructor(
    private billService: BillService,
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
      this.billService.get(params.id).subscribe((bill) => {
        console.log(bill);
        this.bill = bill || new Bill();
        this.bill.status = this.bill.id ? this.bill.status : 'new';
      })
    );
    this.chosenOrder.id = this.bill.orderID;
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
    const query = `${this.billService.billApiUrl}/${this.entityName}?${key}=${value}&_limit=${limit}`;
    return this.http.get<Order[]>(query);
  }

  onFormSubmit(form: NgForm): void {
    this.updating = true;
    this.billService
      .update(this.bill)
      .subscribe(() => this.router.navigate(['bills']));
  }

  setBillToDatabase(bill: Bill): void {
    this.updating = true;
    bill.id = Number(bill.id);
    if (bill.id === 0) {
      this.billService.create(bill).subscribe(
        () => {
          this.toastr.success('You have successfully added a bill.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['bills']);
        },
        (error) =>
          this.toastr.error('There has been an error. The bill is not added.', 'Error!', {
            timeOut: 3000,
          })
      );
    } else {
      this.billService.update(bill).subscribe(
        () => {
          this.toastr.success('You have successfully updated the bill.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['bills']);
        },
        (error) =>
          this.toastr.error('There has been an error. The bill is not updated.', 'Error!', {
            timeOut: 3000,
          })
      );
    }
  }


}