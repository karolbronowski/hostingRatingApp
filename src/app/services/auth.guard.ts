import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad,  } from '@angular/router';
import { AuthService } from './auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
 
@Injectable()
export class AuthGuard implements OnInit, CanActivate {
    
 
    isAuthenticated:boolean;
    constructor(private router: Router, private authService:AuthService) { }
 
    canActivate() {
        if (localStorage.getItem('jwt-token')) {
            if(this.authService.isTokenExpired()){

                this.router.navigate(['/login']);
                return false;
            }
            
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
    ngOnInit(): void {
        this.authService.isAuthenticated.subscribe(data => this.isAuthenticated = !data)
    }
}