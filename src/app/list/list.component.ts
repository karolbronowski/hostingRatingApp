import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  brandPackagesList : any;
  subscription:Subscription;
  constructor(
    private dataService:DataService
  ) 
  {
    this.dataService.getBrandsPackagesList()
    this.subscription = this.dataService.currentBrandPackages
    .subscribe(
      (data)=>this.brandPackagesList = data
    )

  }

  ngOnInit() {
  }

}
