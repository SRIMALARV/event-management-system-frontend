import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../model/event.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/events`);
  }

  getEventById(eventId: string): Observable<Event> {
    return this.http.get<Event>(`${this.API_BASE_URL}/api/events/${eventId}`);
  }

  getEventsByType(type: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/events/type/${type}`);
  }

  getEventsSorted(order: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/events/sorted/${order}`);
  }

  getEventTypeSorted(type: string, order: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/api/events/type/${type}/sorted/${order}`);
  }
}
