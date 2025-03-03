import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../model/feedback.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private API_BASE_URL =environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

   createOrg(username: string, email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.API_BASE_URL}/api/admin/create-org`, { username, email, password, roles: ['org']});
    }

    sendFeedback(feedback: Feedback): Observable<Feedback> {
      return this.http.post<Feedback>(`${this.API_BASE_URL}/api/feedback`, feedback);
    }
    
    getFeedback(feedback: Feedback[]): Observable<Feedback[]> {
      return this.http.get<Feedback[]>(`${this.API_BASE_URL}/api/feedback`);
    }
}
