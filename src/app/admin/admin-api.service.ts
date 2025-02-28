import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private API_BASE_URL =environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

   createOrg(username: string, email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.API_BASE_URL}/api/admin/create-org`, { username, email, password, roles: ['org']});
    }
}
