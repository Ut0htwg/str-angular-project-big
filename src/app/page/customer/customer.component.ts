import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerList$: BehaviorSubject<Customer[]> = this.customerService.list$;

  txt: string = '';
  phraseKey: string = '';
  keyArray: string[] = Object.keys(new Customer());

  // sorter
  columnKey: string = '';
  direction: string = '';

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.customerService.getAll();
  }

  // sorter
  onColumnSelect(key: string): void {
    this.swichDirectionValue();
    this.columnKey = key;
  }

  swichDirectionValue(): any {
    if (this.direction === '' || this.direction === 'dsc') {
      return this.direction = 'asc';
    }
    return this.direction = 'dsc';
  }

  onRemove(customer: Customer): void {
    of(this.customerService.remove(customer.id)).subscribe(
      () => {
        this.toastr.success("You have successfully deleted the customer.", "Törlés!", { timeOut: 3000 });
        this.customerService.getAll();
      },
      error => this.toastr.error("There has been an error. The customer isn't deleted", "Hiba!", { timeOut: 3000 })
    )
  }
}