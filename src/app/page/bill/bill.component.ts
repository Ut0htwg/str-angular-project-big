import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Bill } from 'app/model/bill';
import { BillService } from 'app/service/bill.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  billList$: BehaviorSubject<Bill[]> = this.billService.list$;
  txt: string = '';
  phraseKey: string = '';
  keyArray: string[] = Object.keys(new Bill());

  // sorter
  columnKey: string = '';
  direction: string = '';

  constructor(
    private billService: BillService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.billService.getAll();
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

  onRemove(bill: Bill): void {
    of(this.billService.remove(bill.id)).subscribe(
      () => {
        this.toastr.warning("You have successfully deleted the bill.", "Deleted!", { timeOut: 3000 });
        this.billService.getAll();
      },
      error => this.toastr.error("There has been an error. The bill isn't deleted", "Error!", { timeOut: 3000 })
    )
  }
}
