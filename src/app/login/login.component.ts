import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "node_modules/@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
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
    this.authService.login(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }
}
