import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  user: any = {};
  previewImage: string | ArrayBuffer | null = null;

  message = '';
  isError = false;

  editName = false;
  editUsername = false;
  editEmail = false;

  showPasswordSection = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const stored = this.auth.getUser();
    if (stored) {
      this.user = stored;
      this.previewImage = stored.profileImage || null;
    }
  }

  toggleEdit(field: string) {
    if (field === 'name') this.editName = true;
    if (field === 'username') this.editUsername = true;
    if (field === 'email') this.editEmail = true;
  }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    this.message = '';
    this.isError = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImage = reader.result;
      this.user.profileImage = reader.result;
    };

    reader.readAsDataURL(file);
  }

  updateProfile() {

    this.http.put<any>(
      `http://localhost:8080/users/${this.user.id}`,
      this.user
    ).subscribe({
      next: (res) => {

        this.user = res;
        this.previewImage = res.profileImage;
        this.auth.saveUser(res);

        this.editName = false;
        this.editUsername = false;
        this.editEmail = false;

        this.message = "Profile updated successfully!";
        this.isError = false;
      },
      error: () => {
        this.message = "Profile update failed!";
        this.isError = true;
      }
    });
  }

  changePassword() {

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.message = "Please fill all password fields.";
      this.isError = true;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = "New passwords do not match.";
      this.isError = true;
      return;
    }

    this.http.put<any>(
      `http://localhost:8080/users/change-password/${this.user.id}`,
      {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      }
    ).subscribe({
      next: () => {

        this.message = "Password changed successfully!";
        this.isError = false;

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.showPasswordSection = false;
      },
      error: () => {
        this.message = "Current password is incorrect.";
        this.isError = true;
      }
    });
  }

 deleteAccount() {

  const confirmDelete = confirm("Are you sure you want to permanently delete your account?");

  if (!confirmDelete) return;

  this.http.delete(
    `http://localhost:8080/users/${this.user.id}`
  ).subscribe({
    next: () => {
      localStorage.clear();
      window.location.href = '/register';
    },
    error: () => {
      // Even if backend says user not found,
      // redirect anyway
      localStorage.clear();
      window.location.href = '/register';
    }
  });
}
}