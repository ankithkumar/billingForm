import { Component, OnDestroy } from '@angular/core';
import { Orderdetails } from './service/orderdetails.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private details;
  private hasLoaded;
  private error;
  private detailsSubscriber: Subscription;

  constructor(private orderDetails: Orderdetails) {
    console.log('app component!!');
    this.details = [];
    this.hasLoaded = false;
    this.fetchDetails();
  }

  fetchDetails() {
    this.detailsSubscriber = this.orderDetails.getDetailsUpdatedListener()
            .subscribe(details => {
                this.details = details;
                this.hasLoaded = true;
                console.log('this details on update has!! ', this.details);
            }, error => {
                this.error = error;
                console.log('error occurred', error);
                this.hasLoaded = false;
            });
    this.orderDetails.getDetails()
      .then(details => {
          console.log('val is ',this.details);
          this.details = details;
      })
      .catch(error => {
          this.error = error;
          this.hasLoaded = false;
          console.log('error occurred', error);
      })
  }
  
  deleteProductItem($event, product) {
    console.log('in app deleting ', product);
    this.orderDetails.deleteProduct(product);
  }

  onBillingDetailsChange(event) {
    if (!event.type) {
      console.log('in app changed details are ', event);
      this.orderDetails.updateBillingDetails(event);
    }
  }

  onShippingDetailsChange(event) {
    if (!event.type) {
      console.log('in app changed details are ', event);
      this.orderDetails.updateShippingDetails(event);
    }
  }

  updateBillingDate(event) {
    console.log('billing date!!', event);
    let isEmpty = false;
    if (!event.type) {
      this.details.billing.orderDate = event;
      if (event == '') {
        isEmpty = true;
      }
      this.orderDetails.updateBillingDetails({'details' : this.details.billing, isEmpty});
    }
  }

  updateShippingDate(event) {
    let isEmpty = false;
    if (!event.type || event) {
      this.details.shipping.expectedDate = event;
      if (event == '') {
        isEmpty = true;
      }
      this.orderDetails.updateShippingDetails({'details' : this.details.shipping, isEmpty})
    }
  }

  addProduct() {
    this.orderDetails.addExtraProduct();
  }

  updateProduct(event, product) {
    if (!event.type) {
      this.orderDetails.updateProduct(event.details, product, event.isEmpty);
    }
  }

  save() {
    this.orderDetails.showData();
  }

  parseDate(dateString: string): Date {
    console.log('parseDateMethod!!', dateString);
    if (dateString) {
       console.log(new Date(dateString));
      return new Date(dateString);
    }
    return null;
  }

  ngOnDestroy() {
    this.detailsSubscriber.unsubscribe();
    console.log('in ngOnDestroy of list');
  }
}
