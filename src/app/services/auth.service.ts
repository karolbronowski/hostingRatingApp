import { Injectable, forwardRef, ForwardRefFn, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import * as jwt_decode from 'jwt-decode';
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { JwtResponse } from "../models/jwtResponse";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { DataService } from './data.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ValidationService } from './validation.service';
//import { ProgressBarService } from "./progressBarService";


export const TOKEN_NAME: string = 'jwt-token';

@Injectable()
export class AuthService implements OnInit {
    

    signature: string;
    private authention = new BehaviorSubject<boolean>(true);
    isAuthenticated = this.authention.asObservable();

    constructor(
        private validationService:ValidationService,
        private router:Router,
        private httpClient: HttpClient,
        private _notifications: NotificationsService, 
        //private progressBarService: ProgressBarService
    ) {

        this.authention.next(this.isTokenExpired());
    }


    private loginUrl:string = "http://localhost:5000/api/account/login";
    private registerUrl:string = "http://localhost:5000/api/account/register";

    ngOnInit(): void {

        this.authention.next(this.isTokenExpired());
    }
    setUniqueSign(): void {
        let sign = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        localStorage.setItem("signature",sign)
    }
    getUniqueSign(): string {
        if(localStorage.getItem("signature") == null){
            this.setUniqueSign();
        }
        return localStorage.getItem("signature")
    }
    getToken(): string {
        return localStorage.getItem(TOKEN_NAME);
    }
    
    setToken(token: string): void {
        localStorage.setItem(TOKEN_NAME, token);
    }
    isAdmin(): boolean {
        
        let jwt = localStorage.getItem(TOKEN_NAME);
        if(jwt == null) return false;
        let jwtData = jwt.split('.')[1]
        let decodedJwtJsonData = window.atob(jwtData)
        let decodedJwtData = JSON.parse(decodedJwtJsonData)

        console.log(decodedJwtData)
        if(decodedJwtData.Role == "Admin") return true;
        else return false;

    }
    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
    
        if (decoded.exp === undefined) return null;
    
        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);
        return date;
      }
    
    isTokenExpired(token?: string)  {
        if(!token) token = this.getToken();
        if(!token){
            return true;
        } 
    
        const date = this.getTokenExpirationDate(token);
        if(date === undefined){
            return false;
        }
        return !(date.valueOf() > new Date().valueOf());
    }
    login(email:string, password:string )
    {
        //this.progressBarService.show()
        return this.httpClient.post<JwtResponse>
        (
            this.loginUrl,
            {
                email: email,
                password: password
            }, 
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Access', '*/*')
        },
        )
        .subscribe(
            (data) => {
                this.setToken(data.token);
                this.authention.next(this.isTokenExpired());
                
                if(this.isAdmin())
                {
                    this._notifications.create("Admin login","Logged as admin",NotificationType.Success,false);
                    this.router.navigate(['/admin']);
                }
                else
                {
                    this._notifications.create("Success","Logged in",NotificationType.Success,false);
                    this.router.navigate(['/account']);
                }
               
                //this.progressBarService.hide()
            },
            (err)=> this.processError(err),
            ()=>{
                //this.progressBarService.hide()
            }
        )
    }
    register(email:string, password:string )
    {
        //this.progressBarService.show()
        return this.httpClient.post<JwtResponse>
        (
            this.registerUrl,
            {
                email: email,
                password: password
            }, 
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Access', '*/*')
        },
        )
        .subscribe(
            (data) => {
                this.setToken(data.token);
                this.authention.next(this.isTokenExpired());
                this._notifications.create("Great","Account created.",NotificationType.Success,false);
                this._notifications.create("Success","Logged in",NotificationType.Success,false);
                this.router.navigate(['/']);
            },
            (err)=> this.processError(err),
            ()=>{
                //this.progressBarService.hide()
            }
        )
    }

    logout(): void {
        
        localStorage.removeItem(TOKEN_NAME);
        localStorage.clear();
        this.authention.next(this.isTokenExpired());
        this.router.navigateByUrl('');
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
}