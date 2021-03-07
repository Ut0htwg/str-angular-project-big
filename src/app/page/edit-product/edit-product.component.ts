import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: Product = new Product();
  updating: boolean = false;

  chosenProduct: Product = new Product();

  entityName: string = 'product';
  list$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(
    private productService: ProductService,
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
      this.productService.get(params.id).subscribe((product) => {
        console.log(product);
        this.product = product || new Product();
        this.product.active = this.product.id ? this.product.active : true;
      })
    );
    this.chosenProduct.id = this.product.id;
  }

  productResultFormatter(product: Product): string {
    return `${product.id}`;
  }

  productInputFormatter(product: Product): string {
    if (!product.id) {
      return '';
    }
    return `(${product.id})`;
  }

  like(key: string, value: string, limit: number = 10): Observable<Product[]> {
    key = `${key}_like`;
    const query = `${this.productService.productApiUrl}/${this.entityName}?${key}=${value}&_limit=${limit}`;
    return this.http.get<Product[]>(query);
  }

  onFormSubmit(form: NgForm): void {
    this.updating = true;
    this.productService
      .update(this.product)
      .subscribe(() => this.router.navigate(['products']));
  }

  setProductToDatabase(product: Product): void {
    this.updating = true;
    product.id = Number(product.id);
    if (product.id === 0) {
      this.productService.create(product).subscribe(
        () => {
          this.toastr.success('You have successfully added a product.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['products']);
        },
        (error) =>
          this.toastr.error('There has been an error. The product is not added.', 'Error!', {
            timeOut: 3000,
          })
      );
    } else {
      this.productService.update(product).subscribe(
        () => {
          this.toastr.success('You have successfully updated the product.', 'Success!', {
            timeOut: 3000,
          });
          this.updating = false;
          this.router.navigate(['products']);
        },
        (error) =>
          this.toastr.error('There has been an error. The product is not updated.', 'Error!', {
            timeOut: 3000,
          })
      );
    }
  }
}