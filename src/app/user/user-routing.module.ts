import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../auth.guard';
import { HostComponent } from './host/host.component';
import { JoinEventComponent } from './join-event/join-event.component';

const routes: Routes = [
  {path:'', component: MainComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }   },
  {path:'host', component: HostComponent},
  {path:'join-meet', component: JoinEventComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
