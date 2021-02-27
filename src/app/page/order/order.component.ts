import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderList$: BehaviorSubject<Order[]> = this.orderService.list$;

  txt: string = '';
  phraseKey: string = '';
  keyArray: string[] = Object.keys(new Order());

  // sorter
  columnKey: string = '';
  direction: string = '';

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.orderService.getAll();
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

  onRemove(order: Order): void {
    of(this.orderService.remove(order.id)).subscribe(
      () => {
        this.toastr.success('Sikeresen törölted a terméket!', 'Törlés!', { timeOut: 3000 });
        this.orderService.getAll();
      },
      error => this.toastr.error('Hiba történt a termék törlésekor!', 'Hiba!', { timeOut: 3000 })
    )
  }

}