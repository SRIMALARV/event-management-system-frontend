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
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to change the status to "${status}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.updateEventStatus(eventId, status).subscribe(() => {
          this.fetchEvents();  
          Swal.fire('Updated!', `The status has been changed to "${status}".`, 'success');
        });
      }
    });
  }
  
}
