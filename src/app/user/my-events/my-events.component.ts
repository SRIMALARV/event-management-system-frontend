import { Component } from '@angular/core';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';
import { RegistrationApiService } from '../registration-api.service';
import { RouterLink } from '@angular/router';
import { Registration } from '../../model/regsitration.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportDataService } from '../../export-data.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent {
  myEvents: Event[] = [];
  username: string | null = null;
  isLoading = true;
  registrationData: { [eventId: string]: Registration[] } = {};

  constructor(private hostApi: HostApiService, private registrationApi: RegistrationApiService,
    private exportDataApi: ExportDataService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.loadUserEvents();
  }

  loadUserEvents(): void {
    this.hostApi.getUserEvents().subscribe({
      next: (events) => {
        this.myEvents = events;

        this.myEvents.forEach(event => {
          this.registrationApi.getRegistrationsByEvent(event.id ?? '').subscribe({
            next: (registrations) => {
              this.registrationData[event.id ?? ''] = registrations;
              event.registeredCount = registrations.length;
            }
          });
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

  exportRegistrationData(eventId: string, title: string): void {
    const registrations = this.registrationData[eventId];

    if (!registrations || registrations.length === 0) {
      return;
    }

    const formattedData = registrations.map(reg => ({
      Name: reg.name,
      Email: reg.email,
      Institute: reg.instituteName,
      Course: reg.course,
      Teammates: Array.isArray(reg.teammates) ? reg.teammates.filter(name => name).join(', ') : 'N/A',
    }));

    this.exportDataApi.exportToExcel(formattedData, `Registrations_${title}`);
  }

}
