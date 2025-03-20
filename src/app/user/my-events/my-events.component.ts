import { Component } from '@angular/core';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';
import { RegistrationApiService } from '../registration-api.service';
import { RouterLink } from '@angular/router';
import { Registration } from '../../model/regsitration.model';
import { ExportDataService } from '../../export-data.service';
import moment from 'moment';
import Swal from 'sweetalert2';

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
  showCompletionStatus = false;

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
          event.eventTime = moment(event.eventTime, 'HH:mm').format('hh:mm A');
          const currentDate = new Date();
          if (new Date(event.eventDate) <= currentDate && event.completionStatus === 'incomplete') {
            this.showCompletionStatus = true;
          }
          else if(new Date(event.eventDate) <= currentDate && event.completionStatus === 'completed') {
            this.showCompletionStatus = false;
          }
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
        this.isLoading = false;
      }
    });
  }

  completionStatus(eventId: string): void {
    Swal.fire({
      title: 'Event Completion',
      text: 'Did you successfully host the event?',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hostApi.changeCompletionStatus(eventId, 'completed').subscribe({
          next: (response) => {
            Swal.fire({
              text: 'Event completion marked!', icon: 'success'
            });
          },
          error: (error) => {
            Swal.fire({ text: 'Failed to update event status.', icon: 'error' });
        }
        })
      }
    })
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
