import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string ='';
  email: string ='';
  password: string ='';
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }
    const { username, email, password } = this.signupForm.value;

    this.authService.signup(username, email, password).subscribe(
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
                  title: `Welcome, ${username}!`
                });
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Signup Failed:', error);
      }
    );
  }
}
