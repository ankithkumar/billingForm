import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit{
    @Input('details') details: any;
    billingShippingForm;
    @Output() change: EventEmitter<any>  = new EventEmitter<any>(); 

    constructor() {
        console.log('billingDetails component!! ', this.details);
    }

    ngOnInit() {
        this.initializeForm();
        if (this.details) {
            this.billingShippingForm.setValue({
                firstName: this.details.firstName,
                secondName: this.details.secondName,
                adressLine1: this.details.adressLine1,
                adressLine2: this.details.adressLine2,
                city: this.details.city,
                state: this.details.state,
                zipCode: this.details.zipCode,
                country: this.details.country
            })
        }
        this.onChanges();
    }

    empty(obj) {
        if (!obj.firstName || 
            !obj.secondName ||
            !obj.adressLine1 ||
            !obj.adressLine2 || 
            !obj.city || 
            !obj.state || 
            !obj.country || 
            !obj.state || 
            !obj.zipCode) {
            return true;
        }
        return false;
    }

    onChanges() {
        this.billingShippingForm.valueChanges.subscribe(val => {
            console.log('updated ', val);
            console.log('emitting change!!');
            this.change.emit({
                'details': val,
                'isEmpty': this.empty(val)
            });
        });
    }

    initializeForm() {
        this.billingShippingForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            secondName: new FormControl('', Validators.required),
            adressLine1: new FormControl('', Validators.required),
            adressLine2: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            zipCode: new FormControl('', Validators.required),
            country: new FormControl('',Validators.required)
        });
    }
}
