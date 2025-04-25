import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from './jwt.service';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class SessionService {

  private apiUrl = `${environment.apiUrl}/token`;

  shownAlert: boolean = false;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private http: HttpClient,
    private jwtService: JwtService,
    private titleService: Title,
    private toastr: ToastrService) { }

  startTokenExpirationCheck(): void {
    this.subscription = interval(60000).subscribe(() => {
      this.checkTokenExpiration();
    });
  }

  checkTokenExpiration(): void {
    const tokenExpiration = this.jwtService.getTokenExpirationDate();

    if (tokenExpiration) {
      const tokenExpirationDate = new Date(tokenExpiration);
      const currentDate = new Date();
      const timeDifference = tokenExpirationDate.getTime() - currentDate.getTime();
      const minutesDifference = Math.floor(timeDifference / 60000);

      console.log(`${minutesDifference} minutes to logout`);

      if (minutesDifference === 2 && !this.shownAlert) {
        this.shownAlert = true;
        this.showNewTokenAlert();
      } else if (minutesDifference < 1) {
        this.shownAlert = false;
        this.handleTokenExpiration(this.jwtService.getToken());
      }
    }
  }

  handleTokenExpiration(token: string | null): void {
    if (token) {
      console.log('Token expired');
      this.dialog.closeAll();

      this.authService.logout();
      this.titleService.setTitle('Sesja wygasła');

      const toast = this.toastr.error('Twoja sesja wygasła. Zaloguj się ponownie.', 'Sesja wygasła',
        {
          timeOut: 600000,
          extendedTimeOut: 5000,
          positionClass: 'toast-top-right',
          closeButton: true,
          tapToDismiss: true
        }
      );

      localStorage.setItem('sessionExpiredToastId', toast.toastId.toString());
    }
  }

  showNewTokenAlert(): void {
    let remainingTime = 120;

    const toastId = 'session-expiration-toast';

    const toast = this.toastr.info(
      `Za ${remainingTime} sekund wygaśnie twoja sesja.<br><u>Kliknij tutaj, aby ją przedłużyć.</u>`,
      'Sesja wygaśnie',
      {
        tapToDismiss: false,
        timeOut: 120000,
        extendedTimeOut: 0,
        progressBar: true,
        closeButton: true,
        enableHtml: true,
        positionClass: 'toast-top-right',
        toastClass: `ngx-toastr ${toastId}`,
      }
    );

    const intervalId = setInterval(() => {

      if (!this.shownAlert) {
        clearInterval(intervalId);
        this.toastr.clear(toast.toastId);
        return;
      }

      remainingTime -= 1;

      const toastElement = document.querySelector(`.ngx-toastr.session-expiration-toast`);
      if (toastElement) {
        const messageElement = toastElement.querySelector('.toast-message');
        if (messageElement) {
          messageElement.innerHTML = `Za ${remainingTime} sekund wygaśnie twoja sesja.<br><u>Kliknij tutaj, aby ją przedłużyć.</u>`;
        }
      }

      if (this.jwtService.isLoggedIn()) {
        this.titleService.setTitle(`Sesja wygaśnie za ${remainingTime} sekund`);
      } else {
        clearInterval(intervalId);
        this.toastr.clear(toast.toastId);
      }

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        this.toastr.clear(toast.toastId);
      }
    }, 1000);

    toast.onTap.subscribe(() => {
      clearInterval(intervalId);
      this.toastr.clear(toast.toastId);

      this.generateNewToken().subscribe({
        next: (res) => {
          this.jwtService.setToken(res.token?.result);
          this.toastr.success('Sesja została przedłużona.', 'Sukces');
          this.titleService.setTitle('Sesja przedłużona');
          this.shownAlert = false;
          console.log('New token generated');
        },
        error: (error) => {
          console.error('Error generating new token:', error);
          this.toastr.error('Wystąpił błąd podczas przedłużania sesji.', 'Błąd');
        },
      });
    });
  }

  generateNewToken(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/refresh`, { headers });
  }
}