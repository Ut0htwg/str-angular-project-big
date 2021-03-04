import { Component, OnInit } from '@angular/core';
import { BillService } from 'app/service/bill.service';
import { CustomerService } from 'app/service/customer.service';
import { OrderService } from 'app/service/order.service';
import { ProductService } from 'app/service/product.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfProducts: number = 0;
  numberOfCustomers: number = 0;
  numberOfUnpaidOrders: number = 0;
  amountOfUnpaidBills: number = 0;

  combinedSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private billService: BillService,
  ) { }

  ngOnInit(): void {
    this.combinedSubscription = combineLatest([
      this.productService.list$,
      this.customerService.list$,
      this.orderService.list$,
      this.billService.list$,
    ]).subscribe(
      data => {
        this.numberOfProducts  = data[0].length;
        this.numberOfCustomers = data[1].length;
        this.numberOfUnpaidOrders = data[2].filter(o => o.status !== 'paid').length;
        this.amountOfUnpaidBills = data[3]
          .filter(b => b.status !== 'paid')
          .map(b => b.amount)
          .reduce((prev, curr) => prev + curr, 0);
      }
    );
  
    this.productService.getAll();
    this.customerService.getAll();
    this.orderService.getAll();
    this.billService.getAll();
  }

  ngOnDestroy(): void {
    this.combinedSubscription.unsubscribe();
  }

}
