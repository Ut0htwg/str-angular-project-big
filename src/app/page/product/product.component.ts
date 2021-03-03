import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productList$: BehaviorSubject<Product[]> = this.productService.list$;

  txt: string = '';
  phraseKey: string = '';
  keyArray: string[] = Object.keys(new Product());

  // sorter
  columnKey: string = '';
  direction: string = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.productService.getAll();
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

  onRemove(product: Product): void {
    of(this.productService.remove(product.id)).subscribe(
      () => {
        this.toastr.warning('Sikeresen törölted a terméket!', 'Törlés!', { timeOut: 3000 });
        this.productService.getAll();
      },
      error => this.toastr.error('Hiba történt a termék törlésekor!', 'Hiba!', { timeOut: 3000 })
    )
  }

}