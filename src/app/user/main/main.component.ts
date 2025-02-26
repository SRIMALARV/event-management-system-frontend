import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { EventApiService } from '../event-api.service';
import { Event } from '../../model/event.model'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string | null = null;
  events: Event[] = [];
  selectedEvent: Event |null  = null;
  filteredEvents: Event[] = [];
  dropdownOpen = false;
  dropdownOpenSort = false;
  selectedType: string = 'Select Category';
  selectedSort: string = 'Date';
  selectedEventId: string | null = null;

  
  constructor(private authService: AuthService, private router: Router,
              private eventApiService: EventApiService) {}

  ngOnInit() {
  this.username = localStorage.getItem('username');
  this.loadEvents();
  }

  getEventImage(eventType: string): string {
    const eventImages: { [key: string]: string } = {
      'Conference': 'conference-logo.png',
      'Symposium': 'symposium-logo.png',
      'Workshop': 'workshop-logo.png',
      'Hackathon': 'hackathon-logo.png',
      'Competition': 'competition-logo.png'
    };
    return eventImages[eventType];
  }

  loadEvents(): void {
    this.eventApiService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = [...this.events];
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
}

toggleSortDropdown() {
  this.dropdownOpenSort = !this.dropdownOpenSort;
}

filterByType(eventType: string): void {
  this.selectedType = eventType;
  this.dropdownOpen = !this.dropdownOpen;

  if (eventType === 'All Events') {
    this.loadEvents();
    return;
  }

  this.eventApiService.getEventsByType(eventType).subscribe({
    next: (data) => {
      this.filteredEvents = data;
    },
    error: (error) => {
      console.error("Error fetching events by type:", error);
    }
  });
}

sortEvents(order: string) {
  this.selectedSort = order;
  this.dropdownOpenSort = false;

  if(this.selectedType !== 'All Events' && this.selectedSort) {
    this.eventApiService.getEventTypeSorted(this.selectedType, this.selectedSort).subscribe({
      next: (data) => {
        this.filteredEvents = data;
      },
      error: (error) => {
        console.error("Error while sorting: ", error);
      }
    });
  }
  else {
    this.eventApiService.getEventsSorted(this.selectedSort).subscribe({
      next: (data) => {
        this.filteredEvents = data;
      },
      error: (error) => {
        console.error("Error while sorting all events: ", error);
      }
    });
  }
}

  selectEvent(eventId: string): void {
    this.selectedEventId = eventId;
    this.eventApiService.getEventById(eventId).subscribe({
      next: (data) => {
        this.selectedEvent = data;
      },
      error: (error) => {
        console.error("Error fetching event details", error);
      }
    });
  }

  searchEvents(event: any): void {
    const query = event.target.value.toLowerCase();
  
    this.filteredEvents = this.events?.filter(event => 
      event.title.toLowerCase().includes(query)
    ) || [];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
