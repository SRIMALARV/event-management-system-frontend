import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { EventApiService } from '../event-api.service';
import { Event } from '../../model/event.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HostApiService } from '../host-api.service';
import { Registration } from '../../model/regsitration.model';
import { RegistrationApiService } from '../registration-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  username: string | null = null;
  events: Event[] = [];
  selectedEvent: Event | null = null;
  filteredEvents: Event[] = [];
  dropdownOpen = false;
  dropdownOpenSort = false;

  selectedType: string = 'All Events';
  selectedSort: string = 'Date';
  selectedEventId: string | null = null;

  showRegistrationForm = false;
  registrationForm!: FormGroup;
  institutes: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventApiService: EventApiService,
    private hostApi: HostApiService,
    private fb: FormBuilder,
    private registrationService: RegistrationApiService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.loadEvents();
    this.loadInstitutes();
  }

  /********************* EVENTS*******************************/

  getEventImage(eventType: string): string {
    const eventImages: { [key: string]: string } = {
      'Conference': 'conference-logo.png',
      'Symposium': 'symposium-logo.png',
      'Workshop': 'workshop-logo.png',
      'Hackathon': 'hackathon-logo.png',
      'Competition': 'competition-logo.png'
    };
    return eventImages[eventType];
  }

  loadEvents(): void {
    this.eventApiService.getAllApprovedEvents().subscribe({
      next: (data) => {
        this.events = data;
        const currentDate = new Date();
        this.events = data.filter(event => new Date(event.registrationDeadline) >= currentDate);
        this.filteredEvents = [...this.events];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSortDropdown() {
    this.dropdownOpenSort = !this.dropdownOpenSort;
  }

  filterByType(eventType: string): void {
    this.selectedType = eventType;
    this.dropdownOpen = !this.dropdownOpen;

    if (eventType === 'All Events') {
      this.loadEvents();
      return;
    }

    this.eventApiService.getEventsByType(eventType).subscribe({
      next: (data) => {
        this.filteredEvents = data.filter(event => event.status === "approved");
      },
      error: (error) => {
        console.error("Error fetching events by type:", error);
      }
    });
  }

  sortEvents(order: string) {
    this.selectedSort = order;
    this.dropdownOpenSort = false;

    if (this.selectedType !== 'All Events' && this.selectedSort) {
      this.eventApiService.getEventTypeSorted(this.selectedType, this.selectedSort).subscribe({
        next: (data) => {
          this.filteredEvents = data.filter(event => event.status === "approved");
        },
        error: (error) => {
          console.error("Error while sorting: ", error);
        }
      });
    }
    else {
      this.eventApiService.getEventsSorted(this.selectedSort).subscribe({
        next: (data) => {
          this.filteredEvents = data.filter(event => event.status === "approved");
        },
        error: (error) => {
          console.error("Error while sorting all events: ", error);
        }
      });
    }
  }

  selectEvent(eventId: string): void {
    this.selectedEventId = eventId;
    this.eventApiService.getEventById(eventId).subscribe({
      next: (data) => {
        this.selectedEvent = data;
      },
      error: (error) => {
        console.error("Error fetching event details", error);
      }
    });
  }

  searchEvents(event: any): void {
    const query = event.target.value.toLowerCase();

    this.filteredEvents = this.events?.filter(event =>
      event.title.toLowerCase().includes(query)
    ) || [];
  }

  /** ------------------------ REGISTRATION ------------------------ **/

  showRegisterForm(event: Event) {
    this.showRegistrationForm = true;
    this.selectedEvent = event;
    if (this.selectedEvent.createdBy === this.username) {
      Swal.fire({
        text: 'You cannot register for your event!', icon: 'error'
      });
      return;
    }

    if (this.username) {
      this.registrationService.getRegistrationsByUsername(this.username).subscribe(registrations => {
        const selectedEventId = this.selectedEvent?.id;
        const isRegistered = registrations.some(registration => registration.eventId === selectedEventId);
        if (isRegistered) {
          Swal.fire({ text: 'You have already registered for this event!', icon: 'error' });
        }
      });
    }

    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      instituteName: ['', Validators.required],
      course: ['', Validators.required],
      teammates: this.fb.array([])
    });
    this.addTeammateFields(event.maxParticipants ?? 0);
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

  addTeammateFields(count: number) {
    this.teammates.clear();
    for (let i = 1; i < count; i++) {
      this.teammates.push(
        this.fb.group({
          name: ['']
        })
      );
    }
  }

  get teammates(): FormArray {
    return this.registrationForm.get('teammates') as FormArray;
  }

  submitRegistration() {
    if (this.registrationForm.invalid) {
      return;
    }

    const registrationData: Registration = this.registrationForm.value;
    registrationData.eventId = this.selectedEvent?.id;
    registrationData.username = localStorage.getItem('username') ?? '';

    registrationData.teammates = this.teammates.value.map((teammate: { name: string }) => teammate.name);
    console.log("data:", registrationData);

    this.registrationService.saveRegistration(registrationData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success', title: 'Registration Successful!',
          text: 'You have successfully registered for the event.', confirmButtonText: 'OK'
        });
        this.showRegistrationForm = false;
        this.registrationForm.reset();
      },
      error: () => {
        Swal.fire({
          icon: 'error', title: 'Registration Failed!',
          text: 'Something went wrong. Please try again.', confirmButtonText: 'OK'
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
