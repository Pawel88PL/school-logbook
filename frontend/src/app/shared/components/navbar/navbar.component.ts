import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../core/services/user.service';
import { JwtService } from '../../../core/auth/jwt.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    NgbCollapseModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {

  userName: string | null = null;
  isMenuCollapsed = true;

  constructor(
    public authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getLoggedUser();
    this.authService.loginSuccess$.subscribe(() => {
      this.getLoggedUser();
    });
  }

  getLoggedUser(): void {
    const token = this.jwtService.getToken();
    if (!token) {
      this.userName = null;
      return;
    }
    
    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.userName = user.firstName + ' ' + user.lastName;
      },
      error: (error) => {
        console.error('Error fetching logged user:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}