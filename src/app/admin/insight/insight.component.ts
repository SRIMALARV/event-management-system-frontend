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
  totalApproved: number = 0;
  totalRejected: number = 0;
  totalPending: number = 0;
  totalEvents: number = 0;

  constructor(private orgApi: ManageOrgApiService) { }

  ngOnInit(): void {
    this.orgApi.getOrganizations().subscribe((data) => {
      this.organizations = data;
      this.totalOrganizations = data.length;
      this.organizationNames = data.map((org: { name: string }) => org.name);

      const eventRequests: Observable<any>[] = this.organizationNames.map(orgName =>
        this.orgApi.getEventsByOrganization(orgName)
      );

      forkJoin(eventRequests).subscribe((eventData: Event[][]) => {
        let approvedCounts: number[] = [];
        let rejectedCounts: number[] = [];
        let pendingCounts: number[] = [];

        eventData.forEach((events: Event[]) => {
          const approved = events.filter(event => event.status === 'approved').length;
          const rejected = events.filter(event => event.status === 'rejected').length;
          const pending = events.filter(event => event.status === 'pending').length;

          approvedCounts.push(approved);
          rejectedCounts.push(rejected);
          pendingCounts.push(pending);

          this.totalApproved += approved;
          this.totalRejected += rejected;
          this.totalPending += pending;
          this.totalEvents = this.totalApproved + this.totalPending + this.totalRejected;
        });
        this.renderPieChart(this.totalApproved, this.totalRejected, this.totalPending);
        this.renderStackedChart(approvedCounts, rejectedCounts, pendingCounts);
      });
    });
  }
  renderPieChart(totalApproved: number, totalRejected: number, totalPending: number) {
    new Chart("statusPieChart", {
      type: 'pie',
      data: {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [{
          data: [totalApproved, totalRejected, totalPending],
          backgroundColor: ['rgba(75, 192, 75, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(86, 165, 255, 0.6)'],
          borderColor: ['rgb(75, 192, 75)', 'rgb(255, 99, 132)', 'rgb(86, 179, 255)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
  renderStackedChart(approvedCounts: number[], rejectedCounts: number[], pendingCounts: number[]) {
    new Chart("statusBarChart", {
      type: 'bar',
      data: {
        labels: this.organizationNames,
        datasets: [
          {
            label: 'Approved',
            data: approvedCounts,
            backgroundColor: 'rgba(75, 192, 75, 0.6)',
            borderColor: 'rgb(75, 192, 75)',
            borderWidth: 1
          },
          {
            label: 'Rejected',
            data: rejectedCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
          },
          {
            label: 'Pending',
            data: pendingCounts,
            backgroundColor: 'rgba(86, 165, 255, 0.6)',
            borderColor: 'rgb(86, 179, 255)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            stacked: true
          }
        }
      }
    });
  }
}

