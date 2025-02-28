import { Component } from '@angular/core';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent {
  myEvents: Event[] = [];
  username: string | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private hostApi: HostApiService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.loadUserEvents();
    } else {
      this.errorMessage = "User not logged in.";
    }
  }

  loadUserEvents(): void {
    this.hostApi.getUserEvents().subscribe({
      next: (events) => {
        this.myEvents = events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }
}
