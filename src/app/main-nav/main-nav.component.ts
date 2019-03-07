import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  isAuthenticated:boolean;
  isAdmin:boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService:AuthService
  ) 
  { 
    this.authService.isAuthenticated.subscribe(data => this.isAuthenticated = !data)
    this.isAdmin = this.authService.isAdmin();
  }
  logout(){
    this.authService.logout()
  } 
  ngOnInit() {
  }

}
