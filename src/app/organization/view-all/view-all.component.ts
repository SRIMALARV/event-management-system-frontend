import { Component } from '@angular/core';
import { OrgApiService } from '../org-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.css'
})
export class ViewAllComponent {
  organization: string | null= null; 
  events: Event[] = [];

  constructor(private eventService: OrgApiService) {}

  ngOnInit(): void {
    this.organization = localStorage.getItem('username');
    this.fetchEvents();
    console.log(this.organization);
  }

  fetchEvents(): void {
    const encodedOrganization = encodeURIComponent(this.organization ?? '');
    this.eventService.getEventsByOrganization(encodedOrganization).subscribe(data => {
      this.events = data;
    });
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
