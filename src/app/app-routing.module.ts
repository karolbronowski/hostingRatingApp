import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { AccountComponent } from './account/account.component';
import { AuthAdminGuard } from './services/auth.admin.guard';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthAdminGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
