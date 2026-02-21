import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  name = '';
  username = '';
  email = '';
  password = '';
  otp = '';

  showOtpField = false;
  message = '';
  successMessage = '';

  otpTimer = 0;
  timerDisplay = '';
  interval: any;
  showResend = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  sendOtp() {

  if (this.otpTimer > 0) return;

  this.showResend = false;
  this.message = '';
  this.successMessage = '';

  this.http.post<any>('http://localhost:8080/auth/send-otp', {
    email: this.email
  }).subscribe({
    next: (res) => {
      this.showOtpField = true;
      this.successMessage = res.message;
      this.startTimer();
    },
    error: (err) => {
      this.message = err.error?.error || "Error sending OTP";
    }
  });
}

  verifyOtp() {

    this.http.post<any>('http://localhost:8080/auth/verify-otp', {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      otp: this.otp
    }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        clearInterval(this.interval);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.message = err.error?.error || "Invalid OTP";
      }
    });
  }

  startTimer() {

  clearInterval(this.interval);

  this.otpTimer = 180; // 3 minutes
  this.updateTimerDisplay();

  this.interval = setInterval(() => {

    this.otpTimer--;

    if (this.otpTimer <= 0) {
      clearInterval(this.interval);
      this.otpTimer = 0;
      this.showResend = true;
    }

    this.updateTimerDisplay();

  }, 1000);
}

  updateTimerDisplay() {

    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;

    this.timerDisplay =
      `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  get canResend(): boolean {
    return this.otpTimer === 0 && this.showOtpField;
  }
}