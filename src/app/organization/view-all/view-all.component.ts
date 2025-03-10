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
  dropdownOpen: boolean = false;
  selectedOption: string = 'All Events';
  showOptions: boolean = false;

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

  toggleDropdown() {
    this.dropdownOpen = true;
  }

  filterEvents(event: any): void {
    const query = event.target.value.toLowerCase();

    this.filteredEvents = this.events?.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query)
    ) || [];
  }

  filterByType(type: string) {
    this.dropdownOpen = false;
    const currentDate = new Date();
    this.selectedOption = type;
    this.showOptions = false;

    switch (type) {
      case 'Pending':
        this.filteredEvents = this.events.filter(event =>
          event.status === 'pending' && new Date(event.registrationDeadline) > currentDate);
        break;
      case 'Expired':
        this.filteredEvents = this.events.filter(event =>
          event.status === 'pending' && new Date(event.registrationDeadline) <= currentDate);
        break;
      case 'Ongoing':
        this.filteredEvents = this.events.filter(event =>
          (event.status === 'approved' || event.status === 'rejected') && new Date(event.eventDate) > currentDate);
        break;
      case 'Completed':
        this.filteredEvents = this.events.filter(event =>
          event.status === 'approved' && new Date(event.eventDate) <= currentDate);
        this.showOptions = true;
        break;
      default:
        this.filteredEvents = [...this.events];
    }
  }

  exportData(): void {
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
    Swal.fire({
      text: `Do you want to ${status} the event?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((confirmResult) => {
      if (confirmResult.isConfirmed) {
        if (status === 'rejected') {
          Swal.fire({
            title: 'Enter Rejection Reason',
            input: 'textarea',
            inputPlaceholder: 'Enter the reason for rejection...',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel'
          }).then((rejectResult) => {
            if (rejectResult.isConfirmed && rejectResult.value) {
              this.sendStatusUpdate(eventId, status, rejectResult.value);
            }
          });
        } else {
          this.sendStatusUpdate(eventId, status, '');
        }
      }
    });
  }

  sendStatusUpdate(eventId: string, status: string, reason: string): void {
    this.eventService.updateEventStatus(eventId, status, reason).subscribe(() => {
      this.fetchEvents();
      Swal.fire('Updated!', `The status has been changed to "${status}".`, 'success');
    });
  }

}
