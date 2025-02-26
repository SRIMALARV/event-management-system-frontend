import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { EventApiService } from '../event-api.service';
import { Event } from '../../model/event.model'; 

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string | null = null;
  events: Event[] | null =null;
  selectedEvent: Event |null  = null;
  
  constructor(private authService: AuthService, private router: Router,
              private eventApiService: EventApiService) {}

  ngOnInit() {
  this.username = localStorage.getItem('username');
  this.loadEvents();
  }

  loadEvents(): void {
    this.eventApiService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  



  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
