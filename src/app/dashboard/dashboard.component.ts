import { Component, OnInit } from '@angular/core';
import { BillService } from 'app/service/bill.service';
import { CustomerService } from 'app/service/customer.service';
import { OrderService } from 'app/service/order.service';
import { ProductService } from 'app/service/product.service';
import { combineLatest, Subscription } from 'rxjs';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfActiveProducts: number = 0;
  numberOfActiveCustomers: number = 0;
  numberOfOrders: number = 0;
  numberOfNewOrders: number = 0;
  numberOfShippedOrders: number = 0;
  numberOfPaidOrders: number = 0;
  numberOfUnpaidOrders: number = 0;
  amountOfPaidBills: number = 0;
  amountOfUnpaidBills: number = 0;
  combinedSubscription: Subscription = new Subscription();

  orderChartLabels: Label[] = ["new", "shipped", "paid"];
  orderChartData: ChartDataSets[] = [
    { data: [0, 0, 0], label: "Orders"},
  ]
  billChartLabels: Label[] = ["new", "paid"];
  billChartData: ChartDataSets[] = [
    { data: [0], label: "Bills"}
  ]

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
        this.numberOfActiveProducts  = data[0].filter(p => p.active === true).length;
        this.numberOfActiveCustomers = data[1].filter(c => c.active === true).length;
        this.numberOfUnpaidOrders = data[2].filter(o => o.status !== 'paid').length;
        this.amountOfUnpaidBills = data[3]
          .filter(b => b.status !== 'paid')
          .map(b => b.amount)
          .reduce((prev, curr) => prev + curr, 0);
        this.amountOfPaidBills = data[3].map(b => b.amount).reduce((previous, current) => previous + current, 0);
        this.numberOfOrders = data[2].length;
        this.numberOfNewOrders = data[2].filter(o => o.status === 'new').length;
        this.numberOfShippedOrders = data[2].filter(o => o.status === 'shipped').length;
        this.numberOfPaidOrders = data[2].filter(o => o.status === 'paid').length;
        this.orderChartData[0].data = [this.numberOfNewOrders, this.numberOfShippedOrders, this.numberOfPaidOrders];
        this.billChartData[0].data = [this.amountOfUnpaidBills, this.amountOfPaidBills];
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
