import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { ZoomService } from '../zoom.service';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './host.component.html',
  styleUrl: './host.component.css'
})
export class HostComponent {
  username: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
