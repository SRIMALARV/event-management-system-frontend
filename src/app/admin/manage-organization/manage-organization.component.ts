import { Component } from '@angular/core';
import { AdminApiService } from '../admin-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOrgApiService } from '../manage-org-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.css'
})
export class ManageOrganizationComponent {
  organizations: any[] = [];
  filteredOrganizations: any[] = [];

  constructor(private adminApi: AdminApiService, private manageOrgApi: ManageOrgApiService) {}

  ngOnInit(): void {
    this.manageOrgApi.getOrganizations().subscribe((data) => {
      this.organizations = data;
      this.filteredOrganizations = [...this.organizations];
    });
  }

  filterOrganizations(event: any): void {
    const query = event.target.value.toLowerCase();
 
    this.filteredOrganizations = this.organizations?.filter(org =>
      org.name.toLowerCase().includes(query) ||
      org.email.toLowerCase().includes(query)
    ) || [];
  }

  changePassword(institute: any) {
     Swal.fire({
            title: 'Enter New Password',
            input: 'textarea',
            inputPlaceholder: 'Enter password to change',
            showCancelButton: true,
            confirmButtonText: 'Change',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              console.log(institute);
              this.manageOrgApi.changePassword(institute.name, result.value).subscribe({
                next: () => {
                  Swal.fire({text: "Password Changed successfully", icon: 'success'})
                },
                error: () => {
                  Swal.fire({text: "Failed to change password", icon: 'error'})
                }
            });
            }
          });
  } 

  deleteInstitute(institute: any) {
    Swal.fire({
      title: 'Confirmation',
      text: `Do you want to delete ${institute.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    })
    .then((result) => {
      if(result.isConfirmed) {
        this.manageOrgApi.deleteOrganization(institute.name).subscribe({
          next: () => {
            Swal.fire({text: "Deletion successful", icon: 'success'})
          },
          error: () => {
            Swal.fire({text: "Failed to delete", icon: 'error'})
          }
        });
      }
    }
  )
  }
}
