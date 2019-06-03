import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingComponent } from './billing/billing.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
