import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string ='';
  email: string ='';
  password: string ='';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(): void {
    this.authService.signup(this.username, this.email, this.password).subscribe(
      (response) => {
        console.log('Signup Success:', response);
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
                  title: `Welcome, ${this.username}!`
                });
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Signup Failed:', error);
      }
    );
  }

}
