import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { RegistrationApiService } from '../../user/registration-api.service';
import { ManageOrgApiService } from '../../admin/manage-org-api.service';
import { Registration } from '../../model/regsitration.model';
import { Event } from '../../model/event.model';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-insight',
  standalone: true,
  imports: [],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.css'
})
export class InsightComponent {
  institutes: string[] = [];
  registrationsPerInstitute: { [key: string]: number } = {};
  organization: string | null = null;
  events: Event[] = [];
  eventIdsUnderOrg: string[] = [];
  
  totalEvents: number = 0;
  totalRegistrations: number = 0;
  approvedEvents: number = 0;

  constructor(
    private registrationApi: RegistrationApiService, 
    private orgApi: ManageOrgApiService
  ) {}

  ngOnInit() {
    this.organization = localStorage.getItem('username');

    this.fetchEvents().then(() => {
      this.orgApi.getOrganizations().subscribe({
        next: data => {
          this.institutes = data.map((org: { name: string }) => org.name);
          this.fetchRegistrations();
        }
      });
    });
  }

  fetchEvents(): Promise<void> {
    return new Promise((resolve) => {
      const encodedOrganization = encodeURIComponent(this.organization ?? '');
      this.orgApi.getEventsByOrganization(encodedOrganization).subscribe(data => {
        this.events = data;
        this.totalEvents = data.length;
        this.approvedEvents = data.filter(event => event.status === 'approved').length;
        this.eventIdsUnderOrg = this.events.map(event => event.id ?? ''); 
        resolve();
      });
    });
  }

  fetchRegistrations() {
    const registrationRequests: Observable<Registration[]>[] = this.institutes.map(institute =>
      this.registrationApi.getRegistrationsByInstitution(institute)
    );

    forkJoin(registrationRequests).subscribe(registrationData => {
      this.registrationsPerInstitute = {};
      this.totalRegistrations = 0;

      this.institutes.forEach((institute, index) => {
        const filteredRegistrations = registrationData[index]?.filter(reg =>
          reg.eventId && this.eventIdsUnderOrg.includes(reg.eventId)
        ) || [];

        this.registrationsPerInstitute[institute] = filteredRegistrations.length;
        this.totalRegistrations += filteredRegistrations.length;
      });

      this.renderChart();
    });
  }

  renderChart() {
    new Chart("instituteChart", {
      type: 'line',
      data: {
        labels: Object.keys(this.registrationsPerInstitute).map(name => 
          name.length > 10 ? name.substring(0, 10) + '...' : name
        ), 
        datasets: [{
          label: 'Number of Registrations',
          data: Object.values(this.registrationsPerInstitute),
          backgroundColor: 'rgba(160, 54, 235, 0.5)',
          borderColor: 'rgba(123, 54, 235, 0.86)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return Object.keys(this.registrationsPerInstitute)[tooltipItems[0].dataIndex];
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45, 
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Registrations"
            }
          }
        }
      }
    });
  }
}
