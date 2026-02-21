import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  user = {
    username: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

login() {
  this.auth.login(this.user).subscribe({
    next: (res: any) => {
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.errorMessage =
        err.error?.error || 'Invalid credentials or email not verified';
    }
  });
}
}