import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [ CommonModule, AdminRoutingModule, LoginComponent, SignupComponent ],
  exports: [LoginComponent, SignupComponent],
})
export class AuthModule { }
