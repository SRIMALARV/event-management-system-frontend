import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Feedback } from '../model/feedback.model';
import { AdminApiService } from '../admin/admin-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = null;
  role: string | null = null;
  feedbackText: string = '';

  constructor(private authService: AuthService, private router: Router, private feedbackApi: AdminApiService) { }
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild('footerSection', { static: false }) footer!: ElementRef;

  eventList = [
    { name: 'Competitions', img: 'competition.png' },
    { name: 'Conferences', img: 'conference.png' },
    { name: 'Symposiums', img: 'sympo.png' },
    { name: 'Hackathons', img: 'hackathon.png' },
    { name: 'Workshops', img: 'workshop.png' }
  ];

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  }

  scrollToFooter() {
    this.footer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  moveToLogin() {
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

  navigateTo(route: string) {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate([route]);
    } else {
      this.moveToLogin();
    }
  }

  submitFeedback() {
    if (!this.username) {
      this.moveToLogin();
      return;
    }
    const feedback: Feedback = {
      username: this.username,
      feedback: this.feedbackText
    };

    if (!this.feedbackText.trim()){
      Swal.fire({
        text: 'Please enter some feedback before submitting!', icon: 'warning', title: 'Empty Field'
      })
    } else {
      this.feedbackApi.sendFeedback(feedback).subscribe({
        next: (response) => {
          Swal.fire({
            text: 'Feedback submitted successfully!', icon: 'success', title: 'Successful'
          })
          this.feedbackText = '';
        }
      });
    }
  }


  logout() {
    this.authService.logout();
    window.location.reload();
  }

}
