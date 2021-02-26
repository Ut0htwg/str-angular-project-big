import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bill } from 'app/model/bill';
import { BillService } from 'app/service/bill.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {

  updating: boolean = false;
  bill$: Observable<Bill> = this.activatedRoute.params.pipe(
    switchMap(params => this.billService.get(params.id))
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private billService: BillService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onUpdate(form: NgForm, bill: Bill): void {
    this.updating = true;
    if (bill.id === 0) {
      this.billService.create(bill);
      this.router.navigate(['bills']);
      this.showSuccess();
    } else {
      this.billService.update(bill).subscribe(
        () => this.router.navigate(['bills'])
      );
      this.showInfo();
    }
  }

  showSuccess() {
    this.toastr.success('Sikeres hozzáadás!', 'Üzenet', { timeOut: 3000 })
  }
  showInfo() {
    this.toastr.info('Sikeres módosítás!', 'Üzenet', { timeOut: 3000 })
  }
}
