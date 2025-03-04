import { Component } from '@angular/core';
import { ManageOrgApiService } from '../manage-org-api.service';
import { Chart } from 'chart.js/auto';
import { Observable, forkJoin } from 'rxjs';
import { Event } from '../../model/event.model';

@Component({
  selector: 'app-insight',
  standalone: true,
  imports: [],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.css'
})
export class InsightComponent {

  organizations: any[] = [];
  totalOrganizations: number = 0;
  organizationNames: string[] = [];
  eventCounts: number[] = [];

  constructor(private orgApi: ManageOrgApiService) {}

  ngOnInit(): void {
    this.orgApi.getOrganizations().subscribe((data) => {
      this.organizations = data;
      this.totalOrganizations = data.length;
      this.organizationNames = data.map((org: { name: string }) => org.name);

      const eventRequests: Observable<any>[] = this.organizationNames.map(orgName => 
        this.orgApi.getEventsByOrganization(orgName)
      );

      forkJoin(eventRequests).subscribe((eventData: Event[][]) => {
        this.eventCounts = eventData.map((events: Event[]) => events.length);
        this.renderChart();
      });      
    });
  }

  renderChart() {
    new Chart("eventChart", {
      type: 'bar',
      data: {
        labels: this.organizationNames,
        datasets: [{
          label: 'Number of Events',
          data: this.eventCounts,
          backgroundColor: 'rgba(126, 75, 192, 0.2)',
          borderColor: 'rgb(134, 75, 192)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

