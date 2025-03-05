import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
