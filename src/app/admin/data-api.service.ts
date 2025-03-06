import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getOrganizations(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/api/users/institutes/details`);
  }

  getEventsByOrganization(organization: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/api/organization/${organization}`);
  }

  getMonthlyRegistrations(year: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/api/registrations/monthly/${year}`);
  }
}
