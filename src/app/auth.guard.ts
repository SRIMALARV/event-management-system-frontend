import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  // constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): Observable<boolean> {
  //   return this.authService.isAuthenticated$.pipe(
  //     map(isAuth => {
  //       if (!isAuth) {
  //         this.router.navigate(['/auth']); 
  //         return false;
  //       }
  //       return true;
  //     })
  //   );
  // }
}
