import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Registration } from '../model/regsitration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  saveRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(`${this.API_BASE_URL}/api/registrations/save`, registration);
  }

  getRegistrationsByEvent(eventId: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.API_BASE_URL}/api/registrations/event/${eventId}`);
  }

  getRegistrationsByInstitution(instituteName: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.API_BASE_URL}/api/registrations/institution/${instituteName}`);
  }

  getRegistrationsByUsername(username: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.API_BASE_URL}/api/registrations/user/${username}`);
  }
}
