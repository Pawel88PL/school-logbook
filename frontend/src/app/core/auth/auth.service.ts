import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { RegisterModel, User } from '../../shared/models/user-model';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UpdateUserModel } from '../../shared/models/user-model';

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

    if (this.isAdmin() || this.isEmployee()) {
      this.router.navigate(['/gpps-office']);
    } else {
      this.router.navigate(['/user']);
    }
  }

  getLoggedUser(): Observable<User> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/logged-user`, { headers });
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

  isEmployee(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Employee');
  }

  isTaxpayer(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Taxpayer');
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

  register(userData: RegisterModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/register`, userData, { headers });
  }
}