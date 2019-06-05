import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
    @Input('product') product: any;
    productForm;
    @Output() onChange: EventEmitter<any>  = new EventEmitter<any>(); 
    @Output() deleteProd = new EventEmitter<any>();

    constructor() {
        console.log('product component!! ', this.product);
    }

    ngOnInit() {
        this.initializeForm();
        if (this.product) {
            this.productForm.setValue({
                id: this.product.id,
                name: this.product.name,
                qty: this.product.qty,
                unitPrice: this.product.unitPrice,
                totalPrice: this.product.unitPrice * this.product.qty,
                notes: this.product.notes || ''
            })
        }
        this.onChanges();
    }

    empty(obj) {
        if (!this.productForm.controls['unitPrice'].value ||
            !this.productForm.controls['qty'].value || 
            !this.productForm.controls['id'].value ||
            !this.productForm.controls['name'].value ||
            !this.productForm.controls['totalPrice']) {
            return true;
        }
        return false;
    }

    onChanges() {
        this.productForm.get('qty').valueChanges.subscribe(val => {
            let unitPrice = this.productForm.controls['unitPrice'].value;
            this.productForm.controls['totalPrice'].setValue(val * unitPrice);
        });
        this.productForm.get('unitPrice').valueChanges.subscribe(val => {
            let qty = this.productForm.controls['qty'].value;
            this.productForm.controls['totalPrice'].setValue(val * qty);
        });
        this.productForm.valueChanges.subscribe(val => {
            console.log('updated ', val);
            console.log('emitting change!!');
            this.onChange.emit({
                'details': val,
                'isEmpty': this.empty(val)
            });
        });
    }

    deleteItem() {
        this.deleteProd.emit();
    }

    initializeForm() {
        this.productForm = new FormGroup({
            id: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            qty: new FormControl('', Validators.required),
            unitPrice: new FormControl('', Validators.required),
            totalPrice: new FormControl('', Validators.required),
            notes: new FormControl(''),
        });
    }
}
