import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Login Success:', response);
        this.authService.setToken(response.token);
        this.authService.setRole(response.roles[0]);
        this.redirectUser(response.roles[0]);
      },
      (error) => {
        console.error('Login Failed:', error);
        this.errorMessage = "Invalid username or password!";
      }
    );
  }

  redirectUser(role: string): void {
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['admin']);
        break;
      case 'ROLE_ORGANIZATION':
        this.router.navigate(['org']);
        break;
      case 'ROLE_USER':
        this.router.navigate(['home']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
