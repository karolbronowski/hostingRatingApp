import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  brands: Option[] = [];
  brandsList : any;
  brandPackagesList : any;
  subscription:Subscription

  addBrandForm = this.fb.group({
    name: ["", Validators.required],
    imageUrl: ["", Validators.required]
  });

  addBrandPackageForm = this.fb.group({
    brandId: ["", Validators.required],
    packageName: ["", Validators.required],
    accountCapacity: ["", Validators.required],
    monthlyTransfer: ["", Validators.required],
    emailAccount: ["", Validators.required],
    domains: ["", Validators.required],
    databases: ["", Validators.required],
    ftpAccounts: ["", Validators.required],
    priceForYear: ["", Validators.required],
    priceForNextYear: ["", Validators.required]
  });

  
  
  constructor(
    private _notifications: NotificationsService, private dataService: DataService, public fb: FormBuilder, public router: Router ) {
    
    this.dataService.getBrandsList();
    this.subscription = this.dataService.currentBrands
    .subscribe(
      (data)=>this.brandsList = data
    )
    this.subscription = this.dataService.currentBrands
    .subscribe(
      (data)=>
      {
        this.brands = [];
        data.forEach(element => {
          this.brands.push({ value: element.id, viewValue: element.name });
        });
      }
    )
    this.dataService.getBrandsPackagesList()
    this.subscription = this.dataService.currentBrandPackages
    .subscribe(
      (data)=>this.brandPackagesList = data
    )
  }
  removeBrandPackage(id)
  {
    this.dataService.removeBrandPackage(id).subscribe(
      (data) => {
        this._notifications.create("Success","Usunięto pakiet",NotificationType.Success,false);
        this.dataService.getBrandsPackagesList()
      },
      (err)=>{
        this._notifications.create("Error",err,NotificationType.Error,false);
      }
    )
    
  }
  removeBrand(id)
  {
    this.dataService.removeBrand(id).subscribe(
      (data) => {
        this._notifications.create("Success","Usunięto firmę",NotificationType.Success,false);
        this.dataService.getBrandsList()
      },
      (err)=>{
        this._notifications.create("Error",err,NotificationType.Error,false);
      }
    )
    
  }
  onSubmitBrand() {
    if (this.addBrandForm.valid) {
      var result = this.dataService.createBrand(this.addBrandForm);   
      result.subscribe(
        (data)=>
        {
          this._notifications.create("Success","Dodano nową firme",NotificationType.Success,false);
          this.dataService.getBrandsList();
        },
        (err)=>this.dataService.processError(err)
      )
    }
  }
  onSubmitBrandPackage() {
   
    if (this.addBrandPackageForm.valid) {
      var result = this.dataService.createBrandPackage(this.addBrandPackageForm);   
      result.subscribe(
        (data)=>
        {
          this._notifications.create("Success","Dodano nowy pakiet do firmy",NotificationType.Success,false);
          this.dataService.getBrandsPackagesList();
        },
        (err)=>this.dataService.processError(err)
      )
    }
  }
  

  ngOnInit() {
   
  }
}
export interface Option {
  value: any;
  viewValue: string;
}
