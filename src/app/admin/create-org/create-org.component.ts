import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../admin-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-org',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-org.component.html',
  styleUrl: './create-org.component.css'
})
export class CreateOrgComponent {
 username: string ='';
  email: string ='';
  password: string ='';

  constructor(private authService: AdminApiService, private router: Router) {}

  createOrganization(): void {
    this.authService.createOrg(this.username, this.email, this.password).subscribe(
      (response) => {
        Swal.fire('Success!', 'Created Organization successfully!', 'success');
      },
      (error) => {
        console.error('Signup Failed:', error);
      }
    );
  }
}
