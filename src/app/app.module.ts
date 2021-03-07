import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgmCoreModule } from '@agm/core';
import { EditBillComponent } from './page/edit-bill/edit-bill.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BillComponent } from './page/bill/bill.component';
import { OrderComponent } from './page/order/order.component';
import { EditOrderComponent } from './page/edit-order/edit-order.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SorterPipe } from './pipes/sorter.pipe';
import { CustomerComponent } from './page/customer/customer.component';
import { EditCustomerComponent } from './page/edit-customer/edit-customer.component';
import { ProductComponent } from './page/product/product.component';
import { EditProductComponent } from './page/edit-product/edit-product.component';
import { CustomerSorterPipe } from './pipes/customer-sorter.pipe';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
    }),
    ChartsModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    EditBillComponent,
    BillComponent,
    OrderComponent,
    EditOrderComponent,
    FilterPipe,
    SorterPipe,
    CustomerComponent,
    EditCustomerComponent,
    ProductComponent,
    EditProductComponent,
    CustomerSorterPipe,
    ChartComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
