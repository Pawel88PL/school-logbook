import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/auth/auth.service';
import { JwtService } from '../../core/auth/jwt.service';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../core/models/user-model';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    RouterModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})


export class AdminLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isLoading: boolean = true;

  isSmallScreen: boolean = false;
  sidenavOpened: boolean = false;
  sessionIndex: string | null = null;

  subscriptions: Subscription = new Subscription();

  constructor(
    private adminService: AdminService,
    private breakpointObserver: BreakpointObserver,
  ) { }


  ngOnInit(): void {
    this.adjustSidenav();
    this.initializeSubscription();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToTop();
      this.isLoading = false;
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  adjustSidenav(): void {
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((result: BreakpointState) => {
        this.isSmallScreen = result.matches;
        this.sidenavOpened = !this.isSmallScreen;
      });
  }

  initializeSubscription(): void {
    this.subscriptions.add(
      this.adminService.toggle$.subscribe(() => {
        this.sidenav.toggle();
      })
    );
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
