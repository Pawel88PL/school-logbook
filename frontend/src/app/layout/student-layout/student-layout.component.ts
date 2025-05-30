import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdminService } from '../../core/services/admin.service';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-student-layout',
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    RouterModule
  ],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})

export class StudentLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSmallScreen: boolean = false;
  sidenavOpened: boolean = false;

  subscriptions: Subscription = new Subscription();

  constructor(
    private adminService: AdminService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.adjustSidenav();
    this.initializeSubscription();
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
}