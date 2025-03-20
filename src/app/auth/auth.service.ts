import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private usernameSubject = new BehaviorSubject<string | null>(null);

  token$ = this.tokenSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  private API_BASE_URL = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/api/auth/login`, { username, password }).pipe(
      tap({
        next: (response) => {
          this.setToken(response.token);
          this.setRole(response.roles[0]);
          this.setUsername(response.username);
        },
        error: (error) => { console.error("Login fail(tap):", error); }
      })
    );
  }
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/api/auth/signup`, { username, email, password }).pipe(
      tap({
        next: (response) => {
          this.setToken(response.token);
          this.setRole(response.roles[0]);
          this.setUsername(response.username);
        },
        error: (error) => { console.error("Signup fail(tap):", error); }
      })
    );
  }
  setRole(role: string): void {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  setUsername(name: string): void {
    localStorage.setItem('username',name);
    this.usernameSubject.next(name);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.tokenSubject.next(null);
    this.usernameSubject.next(null);
  }
}
