import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class LayoutComponent implements OnInit {

  name: string = '';
  profileImage: string | null = null;

  isMenuOpen: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.name = user.name;
        this.profileImage = user.profileImage;
      } else {
        this.name = '';
        this.profileImage = null;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.auth.logout();
  }
}