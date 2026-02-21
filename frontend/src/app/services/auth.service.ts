import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';

  // 🔥 This makes layout auto update
  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // 🔹 Login
  login(user: any) {
    return this.http.post(`${this.baseUrl}/login`, user);
  }

  // 🔹 Save & broadcast user
  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  // 🔹 Get user
  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  // 🔹 OTP
  sendOtp(user: any) {
    return this.http.post(`${this.baseUrl}/send-otp`, user);
  }

  verifyOtp(user: any) {
    return this.http.post(`${this.baseUrl}/verify-otp`, user);
  }

  // 🔹 Login check
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // 🔹 Logout everywhere
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}