import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})

export class Orderdetails {
    details;
    private detailsUpdated = new Subject(); 
    constructor(private http: HttpClient) {
        console.log('here in order-details service');
        this.details = {};
    }

    getDetailsUpdatedListener() {
        return this.detailsUpdated.asObservable();
    }

    getDetails() {
        return new Promise<any>((resolve, reject) => {
         if (!this.details) {
             this.raiseUpdatedEvent();
             resolve(this.details);
             return;
         }
         this.fetchDetails().subscribe(values => {
             this.details = values;
             this.raiseUpdatedEvent();
             resolve(this.details);
         }, error => {
             console.log('failed! ',error);
             reject(error);
         })
        });
    }

    raiseUpdatedEvent() {
        console.log('updating ', this.details);
        this.detailsUpdated.next(this.details);
    }

    createProductModal() {
        return {
            id: '',
            name: '',
            qty: '',
            unitPrice: '',
            totalPrice: '',
            notes: '',
            isEmpty: true
        }
    }

    addExtraProduct() {
        let obj = this.createProductModal();
        this.details.products.push(obj);
        this.raiseUpdatedEvent();
    }

    fetchDetails() {
        return this.http.get('./../../assets/customer_details.json')
                .pipe(map(res => {
                    console.log('in pipe ', res)
                    return res
                }));
    }

    updateBillingDetails(obj) {
        this.details.billing = obj.details;
        if (obj.isEmpty != undefined) {
            this.details.billing.isEmpty = obj.isEmpty;
        }
        console.log('changed ', this.details);
    }

    updateShippingDetails(obj) {
        this.details.shipping = obj.details;
        if (obj.isEmpty != undefined) {
            this.details.shipping.isEmpty = obj.isEmpty;
        }
        console.log('changed ', this.details);
    }

    deleteProduct(item) {
        console.log('delete product in service ', item);
        let id = null;
        this.details.products = _.filter(this.details.products, product => {
            return product.id != item.id;
        });
        this.raiseUpdatedEvent();
    }

    updateProduct(newProduct, oldProduct, isEmpty) {
        let id = null;
        _.forEach(this.details.products, (product, index) => {
            if (product.id == oldProduct.id) {
                id = index;
            }
        })
        if (id != null) {
            console.log('updateProduct ', id);
            this.details.products[id] = newProduct;
            this.details.products[id].isEmpty = isEmpty;
        }
    }

    showData() {
        if (this.details.billing.isEmpty !== undefined &&
            this.details.billing.isEmpty) {
                console.log('fill the billing details!!');
                return;
            }
        if (this.details.shipping.isEmpty !== undefined &&
            this.details.shipping.isEmpty) {
                console.log('fill the shipping details!!');
                return;
            }
        let isProductDataEmpty = false;
        _.forEach(this.details.products, product => {
            if (product.isEmpty != undefined && product.isEmpty) {
                isProductDataEmpty = true;
            }
        })
        if (isProductDataEmpty) {
            console.log('product values empty!!');
            return
        }
        console.log('data is ', this.details);
    }
}