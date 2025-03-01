import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { ZoomService } from '../zoom.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  username: string | null = null;
  eventForm!: FormGroup;
  meetingForm: FormGroup;
  meetingDetails: any = null;
  step = 1;

  institutes: string[] = [];

  constructor(private authService: AuthService, private router: Router,
    private fb: FormBuilder, private hostApi: HostApiService,
    private zoomService: ZoomService) {
    this.meetingForm = this.fb.group({
      topic: ['', Validators.required],
      start_time: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      agenda: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      eventDuration: ['', [Validators.required, Validators.min(10)]],
      registrationDeadline: ['', Validators.required],
      eventMode: ['', Validators.required],
      contactDetails: ['', Validators.required],
      location: [''],
      fee: [''],
      minParticipants: [1, [Validators.required, Validators.min(1)]],
      maxParticipants: [''],
      instituteName: ['', Validators.required],
      meetUrl: [''],
      meetId: [''],
      creatorEmail: ['', [Validators.email, Validators.required]],
      meetPasscode: ['']
    });
    this.loadInstitutes();
  }

  loadInstitutes() {
    this.hostApi.getInstitutes().subscribe({
      next: (data) => {
        this.institutes = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  nextStep() {
    if (this.step < 4) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  submitForm() {
    if (this.eventForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill all required details correctly!',
      });
      return;
    }
    const eventData: Event[] = {
      ...this.eventForm.value,
      createdBy: this.username
    };

    this.hostApi.submitEvent(eventData).subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Event submitted successfully!',
      }).then(() => {
        window.location.reload();
      });
    }, error => {
      console.error('Error submitting event:', error);
    });
  }

  scheduleMeeting() {
    if (this.meetingForm.valid) {
      const formData = this.meetingForm.value;

      const startTime = new Date(formData.start_time);
      const formattedStartTime = startTime.toISOString();

      const meetingData = {
        ...formData,
        start_time: formattedStartTime
      };

      this.zoomService.createMeeting(meetingData).subscribe(
        (response) => {
          console.log('Meeting is created:', response);
          this.meetingDetails = response;
        },
        (error) => {
          console.error('Error creating meeting:', error);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
