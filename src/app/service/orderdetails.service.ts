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
             resolve(JSON.parse(JSON.stringify(this.details)));
             return;
         }
         this.fetchDetails().subscribe(values => {
             this.details = values;
             this.raiseUpdatedEvent();
             resolve(JSON.parse(JSON.stringify(this.details)));
         }, error => {
             console.log('failed! ',error);
             reject(error);
         })
        });
    }

    raiseUpdatedEvent() {
        console.log('updating ', this.details);
        this.detailsUpdated.next(JSON.parse(JSON.stringify(this.details)));
    }

    createProductModal() {
        return {
            id: '',
            name: '',
            qty: 0,
            unitPrice: 0,
            totalPrice: 0,
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
        if (!obj) {
            return;
        }
        this.details.billing = obj.details;
        this.details.billing.isEmpty = obj.isEmpty;
        console.log('changed ', this.details);
    }

    updateShippingDetails(obj) {
        this.details.shipping = obj.details;
        this.details.shipping.isEmpty = obj.isEmpty;
        console.log('changed ', this.details);
    }

    deleteProduct(item) {
        console.log('delete product in service ', item);
        let id = null;
        this.details.products = _.filter(this.details.products, product => {
            return (product.id != item.id &&
                    product.name != item.name &&
                    product.qty != item.qty ||
                    product.unitPrice != item.unitPrice);
        });
        this.raiseUpdatedEvent();
    }

    updateProduct(newProduct, oldProduct, isEmpty) {
        let id = null;
        _.forEach(this.details.products, (product, index) => {
            if (product.id == oldProduct.id ||
                product.name == oldProduct.name ||
                product.qty === oldProduct.qty ||
                product.unitPrice === oldProduct.unitPrice) {
                id = index;
            }
        })
        if (id != null) {
            console.log('updateProduct ', id);
            this.details.products[id] = newProduct;
            this.details.products[id].isEmpty = isEmpty;
        } else {
            this.details.products.push(newProduct);
            this.raiseUpdatedEvent();
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