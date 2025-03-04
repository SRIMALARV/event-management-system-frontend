import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageOrgApiService {

  private API_BASE_URL = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }


  getOrganizations(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/api/users/institutes/details`);
  }

  changePassword(username: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.API_BASE_URL}/api/auth/update-password`, { username, newPassword });
  }

  deleteOrganization(username: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/api/users/delete/${username}`);
  }

}
