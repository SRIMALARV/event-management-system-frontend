import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../auth.guard';
import { HostComponent } from './host/host.component';
import { JoinEventComponent } from './join-event/join-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';

const routes: Routes = [
  {path:'', component: MainComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }   },
  {path:'host', component: HostComponent, 
    children: [
      {path:'', component: CreateEventComponent},
      {path:'create-event', component: CreateEventComponent},
      {path:'my-events', component: MyEventsComponent},
      {path:'my-events/edit-event/:id', component: CreateEventComponent},
    ]
  },
  {path:'join-meet', component: JoinEventComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
