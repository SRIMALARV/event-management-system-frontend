import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth.guard';
import { CreateOrgComponent } from './create-org/create-org.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  {path:'', component: DashboardComponent, canActivate: [AuthGuard],data: { roles: ['ROLE_ADMIN'] },
  children: [
    {path:'register', component: CreateOrgComponent},
    {path:'organizations', component: ManageOrganizationComponent},
    {path:'feedback', component: FeedbackComponent},
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
