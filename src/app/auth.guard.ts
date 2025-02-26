import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); 
    const expectedRoles = route.data['roles'] as string[]; 

    if (token && userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/']); 
      return false;
    }
  }
}
