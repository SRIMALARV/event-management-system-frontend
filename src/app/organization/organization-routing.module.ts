import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ViewAllComponent } from './view-all/view-all.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { InsightComponent } from './insight/insight.component';

const routes: Routes = [
  {path: '', component: MainComponent, data: { roles: ['ROLE_ORGANIZATION'] },
    children: [
      { path: '', redirectTo: 'view-all', pathMatch: 'full' },
      {path:'view-all', component: ViewAllComponent},
      {path:'view-all/view-event/:id', component: ViewEventComponent},
      {path:'insight', component: InsightComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
