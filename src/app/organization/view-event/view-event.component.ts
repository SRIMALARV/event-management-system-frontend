import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrgApiService } from '../org-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.css'
})
export class ViewEventComponent {
  event!: Event;
  eventId: string = '';

  constructor(private route: ActivatedRoute, private eventService: OrgApiService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.eventId);
    if (this.eventId) {
      this.fetchEventDetails();
    }
  }

  fetchEventDetails(): void {
    this.eventService.getEventById(this.eventId).subscribe(
      (data) => {
        this.event = data;
        console.log(this.event);
      },
      (error) => {
        console.error('Error fetching event:', error);
      }
    );
  }
}
