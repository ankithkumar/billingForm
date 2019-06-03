import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import _ from 'lodash';
@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit{
    @Input('product') product: any;
    productForm;
    @Output() change: EventEmitter<any>  = new EventEmitter<any>();
    @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        console.log('product component!!');
    }

    setValue(product) {
        this.productForm.setValue({
            id: product.id,
            name: product.name,
            qty: product.qty,
            unitPrice: product.unitPrice,
            totalPrice: product.qty * product.unitPrice,
            notes: product.notes || ''
        })
    }
    ngOnInit() {
        this.initializeForm();
        if (this.product) {
           this.setValue(this.product) 
        }
        this.onChanges();
    }

    deleteProduct() {
        this.deleteItem.emit();
    }

    empty(val) {
        if (!val.id ||
            !val.name ||
            !val.qty ||
            !val.unitPrice ||
            !val.totalPrice
        ) {
            return true;
        } 
        return false;
    }

    onChanges() {
        this.productForm.valueChanges.subscribe(val => {
            console.log('updated in', val);
            console.log('emitting change!!');
            this.change.emit({
                'details': val,
                'isEmpty': this.empty(val)
            });
        });
    }

    initializeForm() {
        this.productForm = new FormGroup({
            id: new FormControl(''),
            name: new FormControl(''),
            qty: new FormControl(''),
            unitPrice: new FormControl(''),
            totalPrice: new FormControl(''),
            notes: new FormControl('')
        });
    }
}
