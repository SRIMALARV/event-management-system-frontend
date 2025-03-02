import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class OrgApiService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getEventsByOrganization(organization: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/organization/${organization}`);
  }

  updateEventStatus(eventId: string, status: string, reason: string): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/api/organization/${eventId}/${status}`, { reason });
  }  

  getEventById(eventId: string): Observable<Event> {
    return this.http.get<Event>(`${this.API_BASE_URL}/api/events/${eventId}`);
  }
}
