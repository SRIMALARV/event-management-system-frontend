import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  this.username = localStorage.getItem('username');
  }

  events = [
    { title: 'Tech Conference', date: '2025-03-10', location: 'NYC', description: 'A conference about technology trends.' },
    { title: 'Startup Meetup', date: '2025-04-15', location: 'San Francisco', description: 'Networking event for startups.' },
    { title: 'AI Workshop', date: '2025-05-20', location: 'Chicago', description: 'Hands-on AI training session.' }
  ];

  selectedEvent: any = null;

  selectEvent(event: any) {
    this.selectedEvent = event;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
