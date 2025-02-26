import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService,private router: Router) { }
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }
@ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  eventList = [
    { name: 'Competitions', img: 'competition.png' },
    { name: 'Conferences', img: 'conference.png' },
    { name: 'Symposiums', img: 'sympo.png' },
    { name: 'Hackathons', img: 'hackathon.png' },
    { name: 'Workshops', img: 'workshop.png' }
  ];

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -260, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 260, behavior: 'smooth' });
  }

  navigateTo(route: string) {
    const token = localStorage.getItem('token'); 

    if (token) {
      this.router.navigate([route]); 
    } else {
      Swal.fire({
      title: 'Access Denied!',
      text: 'You must be logged in to access this page.',
      icon: 'warning',
      toast: true,
      position: 'top-end',
      showConfirmButton: true,
      confirmButtonText: 'Login',
      timer: 4000
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/auth']); 
      }
    });
  }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
