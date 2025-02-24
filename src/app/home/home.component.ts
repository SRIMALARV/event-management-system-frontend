import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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

}
