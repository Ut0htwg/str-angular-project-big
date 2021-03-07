import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './page/product/product.component';
import { EditProductComponent } from './page/edit-product/edit-product.component';
import { CustomerComponent } from './page/customer/customer.component';
import { EditCustomerComponent } from './page/edit-customer/edit-customer.component';
import { OrderComponent } from './page/order/order.component';
import { EditOrderComponent } from './page/edit-order/edit-order.component';
import { BillComponent } from './page/bill/bill.component';
import { EditBillComponent } from './page/edit-bill/edit-bill.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'products',
    component: ProductComponent
  },
  {
    path: 'products/:id',
    component: EditProductComponent
  },
  {
    path: 'customers',
    component: CustomerComponent
  },
  {
    path: 'customers/:id',
    component: EditCustomerComponent
  },
  {
    path: 'orders',
    component: OrderComponent,
  },
  {
    path: 'orders/:id',
    component: EditOrderComponent,
  },
  {
    path: 'bills',
    component: BillComponent
  },
  {
    path: 'bills/:id',
    component: EditBillComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
