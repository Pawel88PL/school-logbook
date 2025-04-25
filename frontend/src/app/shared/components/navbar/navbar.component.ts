import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';


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
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.initializeNavbar();
    }

    this.authService.loginSuccess$.subscribe(() => {
      this.initializeNavbar();  // Wywołanie logiki inicjalizującej
    });
  }

  initializeNavbar(): void {
    this.userName = this.authService.getName();
  }

  logout() {
    this.authService.logout();
  }
}