import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.authService.setRole(response.roles[0]);
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: 'swal-success-toast'
          }
        }).fire({
          icon: 'success',
          title: `Welcome, ${username}!`
        });
        this.redirectUser(response.roles[0]);
      },
      (error) => {
        this.errorMessage = "Invalid username or password!";
      }
    );
  }

  redirectUser(role: string): void {
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['home']);
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
