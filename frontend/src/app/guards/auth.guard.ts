import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private router: Router) {}

  canActivateChild(): boolean {

    const user = localStorage.getItem('user');

    if (user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}