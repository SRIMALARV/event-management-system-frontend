import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }, 
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }, 
  { path: 'org', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule) }, 
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) }, 
  { path: '**', redirectTo: '' }  
];
