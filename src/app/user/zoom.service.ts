import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/api/create-meeting';


  createMeeting(meetingData: any): Observable<any> {
    return this.http.post(this.apiUrl, meetingData);
  }
}
