import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("jwt-token")) {
      if (this.authService.isTokenExpired()) {
        return false;
      }
      this.router.navigate(["/account"]);
      return true;
    }
    return false;
  }
  hideEmail = false;
  hide = true;

  loginForm = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  submitted = false;

  onSubmit() {
    this.authService.register(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }

}
