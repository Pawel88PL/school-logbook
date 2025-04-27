import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor() { }

  private toggleSubject = new Subject<void>();
  toggle$ = this.toggleSubject.asObservable();

  toggleSidenav(): void {
    this.toggleSubject.next();
  }
}