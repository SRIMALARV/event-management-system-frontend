import { Component } from '@angular/core';
import { OrgApiService } from '../org-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { ExportDataService } from '../../export-data.service';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.css'
})
export class ViewAllComponent {
  organization: string | null = null;
  events: Event[] = [];
  filteredEvents: Event[] = [];

  constructor(private eventService: OrgApiService, private exportDataApi: ExportDataService) { }

  ngOnInit(): void {
    this.organization = localStorage.getItem('username');
    this.fetchEvents();
    console.log(this.organization);
  }

  fetchEvents(): void {
    const encodedOrganization = encodeURIComponent(this.organization ?? '');
    this.eventService.getEventsByOrganization(encodedOrganization).subscribe(data => {
      this.events = data;
      this.filteredEvents = [...this.events];
    });
  }

  filterEvents(event: any): void {
    const query = event.target.value.toLowerCase();
 
    this.filteredEvents = this.events?.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query)
    ) || [];
  }

  exportData():void {
    const eventsData = this.events;

    if (!eventsData || eventsData.length === 0) {
      return;
    }

    const formattedData = eventsData.map(event => ({
      Title: event.title,
      Type: event.type,
      Date: event.eventDate,
      Deadline: event.registrationDeadline,
      Status: event.status,
      Host: event.createdBy,
      Host_Email: event.creatorEmail
    }));

    this.exportDataApi.exportToExcel(formattedData, `Events_${this.organization}`);
  }

  updateStatus(eventId: string, status: string): void {
    if (status === 'rejected') {
      Swal.fire({
        title: 'Enter Rejection Reason',
        input: 'textarea',
        inputPlaceholder: 'Enter the reason for rejection...',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.sendStatusUpdate(eventId, status, result.value);
        }
      });
    } else {
      this.sendStatusUpdate(eventId, status, '');
    }
  }
  sendStatusUpdate(eventId: string, status: string, reason: string): void {
    this.eventService.updateEventStatus(eventId, status, reason).subscribe(() => {
      this.fetchEvents();
      Swal.fire('Updated!', `The status has been changed to "${status}".`, 'success');
    });
  }

}
