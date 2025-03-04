import { Component } from '@angular/core';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { CommonModule } from '@angular/common';
import { RegistrationApiService } from '../registration-api.service';
import { RouterLink } from '@angular/router';

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

  constructor(private hostApi: HostApiService, private registrationApi: RegistrationApiService) {}

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
}
