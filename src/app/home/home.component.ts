import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = null;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    console.log("here:",localStorage.getItem('username'));
    this.authService.username$.subscribe(name => {
      this.username = name;
    });
  }
@ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  eventList = [
    { name: 'Competitions', img: 'competition.png' },
    { name: 'Conferences', img: 'conference.png' },
    { name: 'Symposiums', img: 'sympo.png' },
    { name: 'Hackathons', img: 'hackathon.png' },
    { name: 'Cultural Fests', img: 'fest.png' }
  ];

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -260, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 260, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}
