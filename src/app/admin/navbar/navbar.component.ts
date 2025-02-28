import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null;
  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }
  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
