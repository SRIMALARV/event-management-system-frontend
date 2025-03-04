import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Event } from '../model/event.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostApiService {
 private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  submitEvent(formData: Event[]): Observable<Event[]> {
    return this.http.post<Event[]>(`${this.API_BASE_URL}/api/events`, formData);
  }  

  getInstitutes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE_URL}/api/users/institutes`);
  }

  getUserEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/events/my-events`);
  }

  updateEvent(eventId: string, eventData: Partial<Event>) {
    return this.http.patch<Event>(`/api/events/${eventId}`, eventData, { responseType: 'json' });
  }
  
}
