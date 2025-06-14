import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn: boolean = false;

  private loginSuccess = new Subject<void>();
  loginSuccess$ = this.loginSuccess.asObservable();

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  afterSuccessLogin(token: string): void {
    this.jwtService.setToken(token);
    this.jwtService.decodeToken(token);
    this.loggedIn = true;
    this.loginSuccess.next();

    const toastId = localStorage.getItem('sessionExpiredToastId')

    if (toastId) {
      localStorage.removeItem('sessionExpiredToastId');
      this.toastr.clear(Number(toastId));
    }

    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isTeacher()) {
      this.router.navigate(['/teacher']);
    } else if (this.isStudent()) {
      this.router.navigate(['/student']);
    }
    else {
      this.router.navigate(['/']);
    }
  }

  getName(): string | null {
    const token = this.jwtService.getToken();
    if (!token) return null;
    const decodedToken = this.jwtService.decodeToken(token);
    return decodedToken.unique_name + ' ' + decodedToken.surname;
  }

  isAdmin(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Administrator');
  }

  isTeacher(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Teacher');
  }

  isStudent(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Student');
  }

  isLoggedIn(): boolean {
    const token = this.jwtService.getToken();
    return !!token && !this.jwtService.isTokenExpired();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        // Obsługa udanego logowania
        const token = res.token?.result;
        if (token) {
          this.afterSuccessLogin(token);
        } else {
          this.jwtService.clearToken();
          this.loggedIn = false;
          throw new Error('Niepoprawny token');
        }
      }),
      catchError(error => {
        // Obsługa błędów logowania
        const errorMessage = error.error?.message || 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
        return throwError(() => errorMessage);
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/login']);
      localStorage.removeItem('token');
    }
  }
}