import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageOrgApiService } from '../manage-org-api.service';
import { Event } from '../../model/event.model';

@Component({
  selector: 'app-view-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-events.component.html',
  styleUrl: './view-events.component.css'
})
export class ViewEventsComponent {

  orgName: string = '';
  events: Event[] = [];
  filteredEvents: Event[] =[];

  constructor(private route: ActivatedRoute, private eventApi: ManageOrgApiService) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const encodedName = params.get('name'); 
      if (encodedName) {
        this.orgName = decodeURIComponent(encodedName); 
        this.loadEvents();
      }
    });
  }

  loadEvents() {
    if (!this.orgName) return; 
    const encodedOrganization = encodeURIComponent(this.orgName ?? '');
    this.eventApi.getEventsByOrganization(encodedOrganization).subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.filteredEvents = [...this.events];
      },
      error: (err) => {
        console.error(`Error fetching events for: ${encodedOrganization}`, err);
      }
    });
  }

  filterEvents(event: any): void {
    const query = event.target.value.toLowerCase();
 
    this.filteredEvents = this.events?.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query)
    ) || [];
  }
}
