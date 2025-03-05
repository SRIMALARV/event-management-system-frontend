import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HostApiService } from '../host-api.service';
import { Event } from '../../model/event.model';
import { ZoomService } from '../zoom.service';
import Swal from 'sweetalert2';
import { EventApiService } from '../event-api.service';
import * as moment from 'moment-timezone';


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
  eventId: string | null = null;

  constructor(
    private authService: AuthService, private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder, private hostApi: HostApiService, private zoomService: ZoomService,
    private eventApi: EventApiService) {
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

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.loadEventDetails(this.eventId);
      }
    });
  }

  loadInstitutes() {
    this.hostApi.getInstitutes().subscribe({
      next: (data) => {
        this.institutes = data;
      },
      error: (error) => {
        console.error('Error fetching institutes:', error);
      }
    });
  }

  loadEventDetails(eventId: string) {
    this.eventApi.getEventById(eventId).subscribe({
      next: (eventData: Event) => {
        this.eventForm.patchValue(eventData);
      },
      error: () => {
        console.error('Error fetching event details');
      }
    });
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
    let eventData = { ...this.eventForm.value, createdBy: this.username };

    if (this.eventId) {
      const updatedData: any = {};
      Object.keys(this.eventForm.controls).forEach((key) => {
        if (this.eventForm.controls[key].dirty) {
          updatedData[key] = this.eventForm.value[key];
        }
      });
      eventData = { ...eventData, ...updatedData };
    }
    else if (this.eventForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill all required details correctly!',
      });
      return;
    }

    this.hostApi.submitEvent(eventData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event submitted successfully!',
        }).then(() => {
          this.router.navigate(['/host']);
        });
      },
      (error) => {
        console.error('Error submitting event:', error);
      }
    );
  }



  scheduleMeeting() {
    if (this.meetingForm.valid) {
      const formData = this.meetingForm.value;

      const userTimeZone = moment.tz.guess(); 
      const startTime = moment.tz(formData.start_time, userTimeZone).utc().format();

      const meetingData = {
        ...formData,
        start_time: startTime, 
        timezone: userTimeZone, 
        type: 2
      };

      this.zoomService.createMeeting(meetingData).subscribe(
        (response) => {
          console.log('Meeting created:', response);
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

