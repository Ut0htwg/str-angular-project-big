import { Component, OnInit } from '@angular/core';
import { BillService } from 'app/service/bill.service';
import { Bill } from 'app/model/bill';
import { CustomerService } from 'app/service/customer.service';
import { OrderService } from 'app/service/order.service';
import { ProductService } from 'app/service/product.service';
import { combineLatest, Subscription } from 'rxjs';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import * as Chartist from 'chartist';

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
  salesUpdateTime: string = '';
  dayIndeces: number [] = [];
  DayIndex: number [] = [];

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

  startAnimationForLineChart(chart){
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function(data) {
      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if(data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };

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
        
        /* ----==== Daily Sales Chart initialization For Documentation ====---- */
        this.dayIndeces = data[3]
          // .filter(b => b.status === 'paid')
          .map(b => new Date(b.datumPaid).getDay());
        let diMax = 0;
        for(let i=0; i<7; i++) {
          this.DayIndex [i] = this.dayIndeces.filter(x => x==i).length;
          if (this.DayIndex [i] > diMax) {
            diMax = this.DayIndex [i];
          }
        }
        const dataDailySalesChart: any = {
          labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          series: [ [
             this.DayIndex [0],this.DayIndex [1],this.DayIndex [2],this.DayIndex [3],this.DayIndex [4],this.DayIndex [5],this.DayIndex[6]
              // 10,2,3,3,4,5,2
            ]
          ]
        };


        const nd = new Date();
        this.salesUpdateTime = nd.toISOString();

        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: diMax+5, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        };

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);

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
