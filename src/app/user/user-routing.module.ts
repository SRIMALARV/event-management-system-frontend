import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {path:'', component: MainComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
