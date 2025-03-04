import { Component } from '@angular/core';
import { HostApiService } from '../host-api.service';
import { ActivatedRoute } from '@angular/router';
import { EventApiService } from '../event-api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZoomService } from '../zoom.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {
  eventId: string | null = null;
  username: string | null = null;
  eventForm!: FormGroup;
  meetingForm!: FormGroup;
  meetingDetails: any = null;
  step = 1;

  constructor(private hostApi: HostApiService, private route: ActivatedRoute,
    private eventApi: EventApiService, private zoomService: ZoomService, private fb: FormBuilder) {
    this.meetingForm = this.fb.group({
      topic: ['', Validators.required],
      start_time: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      agenda: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      if (this.eventId) {
        this.loadEventDetails(this.eventId);
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

  loadEventDetails(eventId: string) {
    this.eventApi.getEventById(eventId).subscribe({
      next: (eventData) => {
        this.eventForm.patchValue(eventData);
      },
      error: (err) => {
        console.error('Error fetching event:', err);
      }
    });
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

    const eventData = this.eventForm.value;

    if (this.eventId) {
      this.hostApi.updateEvent(this.eventId, eventData).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Event updated successfully!',
        }).then(() => {
          window.location.reload();
        });
      }, error => {
        console.error('Error updating event:', error);
      });
    } else {
      const newEventData = { ...eventData, createdBy: this.username };
      this.hostApi.submitEvent(newEventData).subscribe(response => {
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
  }

  scheduleMeeting() {
    if (this.meetingForm.valid) {
      const formData = this.meetingForm.value;

      const startTime = new Date(formData.start_time);
      const formattedStartTime = startTime.toISOString();

      const meetingData = {
        ...formData,
        start_time: formattedStartTime,
        type: 2
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

}  