import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import {  FormGroup } from "@angular/forms";
//import { ProgressBarService } from "./progressBarService";
import { AuthService } from "./auth.service";
import { MatSnackBar } from "node_modules/@angular/material";
import { ValidationService } from "./validation.service";
import { NotificationType, NotificationsService } from 'angular2-notifications';

@Injectable()
export class DataService implements OnDestroy {
  ngOnDestroy(): void {
    
  }
  

  private brands = new BehaviorSubject<any>([]);
  currentBrands = this.brands.asObservable();

  private brandPackages = new BehaviorSubject<any>([]);
  currentBrandPackages = this.brandPackages.asObservable();

  subscription: Subscription;

  private sign =  this.authService.getUniqueSign();
  private host = "http://localhost:5000";

  errors: string[];
  error:string;
  //Brands
  private getBrandListUrl: string = this.host + "/api/brands/list";
  private getBrandPackagesListUrl: string = this.host + "/api/brands/packages/list";
  private createBrandUrl: string = this.host + "/api/brands/create";
  private createBrandPackageUrl: string = this.host + "/api/brands/packages/create";
  private removeBrandPackageUrl: string = this.host + "/api/brands/packages/";
  private removeBrandUrl: string = this.host + "/api/brands/";


  constructor(
    private validationService:ValidationService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private _notifications: NotificationsService, 
    //private progressBarService: ProgressBarService,
    public snackBar: MatSnackBar,
  ) {}
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  //ERROR
  processError(err) {
    if(err.status == 500)
    {
      
      this._notifications.create("Error",err.error.detailedMessage,NotificationType.Error,false);
    }
    if(err.status == 400)
    {

      this._notifications.create("Error",err.statusText,NotificationType.Error,false);
    }

    this.validationService.handleError(err)
    //this.progressBarService.hide();
  }
  //Brands
  getBrandsList(): any {
    this.httpClient.get<any>(this.getBrandListUrl)
    .subscribe(
      (data) => this.brands.next(data),
      (err) => this.processError(err)
    );
  }
  getBrandsPackagesList(): any {
    this.httpClient.get<any>(this.getBrandPackagesListUrl)
    .subscribe(
      (data) => this.brandPackages.next(data),
      (err) => this.processError(err)
    );
  }
  createBrand(
    form: FormGroup,
  ) {

    return this.httpClient.post<any>(
      this.createBrandUrl,
      {
        imageUrl: form.controls.imageUrl.value,
        name: form.controls.name.value,
      },
      {
        headers: new HttpHeaders()
          .set("Authorization", "Bearer " + localStorage.getItem("jwt-token"))
          .set("Content-Type", "application/json")
          .set("Access", "*/*"),
        withCredentials: true
      }
    );
  }
  createBrandPackage(
    form: FormGroup,
  ) {

    return this.httpClient.post<any>(
      this.createBrandPackageUrl,
      {
        brandId: form.controls.brandId.value,
        packageName: form.controls.packageName.value,
        accountCapacity: form.controls.accountCapacity.value,
        monthlyTransfer: form.controls.monthlyTransfer.value,
        emailAccount: form.controls.emailAccount.value,
        domains: form.controls.domains.value,
        databases: form.controls.databases.value,
        ftpAccounts: form.controls.ftpAccounts.value,
        priceForYear: form.controls.priceForYear.value,
        priceForNextYear: form.controls.priceForNextYear.value,
      },
      {
        headers: new HttpHeaders()
          .set("Authorization", "Bearer " + localStorage.getItem("jwt-token"))
          .set("Content-Type", "application/json")
          .set("Access", "*/*"),
        withCredentials: true
      }
    );
  }
  removeBrand(
    id
  ) {

    return this.httpClient.delete<any>(
      this.removeBrandUrl+id+"/delete",
      {
        headers: new HttpHeaders()
          .set("Authorization", "Bearer " + localStorage.getItem("jwt-token"))
          .set("Content-Type", "application/json")
          .set("Access", "*/*"),
        withCredentials: true
      }
    );
  }
  removeBrandPackage(
    id
  ) {

    return this.httpClient.delete<any>(
      this.removeBrandPackageUrl+id+"/delete",
      {
        headers: new HttpHeaders()
          .set("Authorization", "Bearer " + localStorage.getItem("jwt-token"))
          .set("Content-Type", "application/json")
          .set("Access", "*/*"),
        withCredentials: true
      }
    );
  }
}
