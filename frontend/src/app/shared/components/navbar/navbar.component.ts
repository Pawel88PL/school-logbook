import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../core/services/user.service';
import { JwtService } from '../../../core/auth/jwt.service';
import { AdminService } from '../../../core/services/admin.service';
import { filter, Subscription } from 'rxjs';


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

export class NavbarComponent implements OnInit, OnDestroy {

  userName: string | null = null;
  isMenuCollapsed = true;
  showMenuButton = false;

  private subscriptions = new Subscription();

  constructor(
    private adminService: AdminService,
    public authService: AuthService,
    private eRef: ElementRef,
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getLoggedUser();
    this.authService.loginSuccess$.subscribe(() => {
      this.getLoggedUser();
    });

    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.showMenuButton = event.urlAfterRedirects.startsWith('/admin');
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  onMenuButtonClick(): void {
    this.adminService.toggleSidenav();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Jeśli kliknięto poza navbar i menu jest otwarte — zamknij
    if (!this.eRef.nativeElement.contains(targetElement) && !this.isMenuCollapsed) {
      this.isMenuCollapsed = true;
    }
  }
}