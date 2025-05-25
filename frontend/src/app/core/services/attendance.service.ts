import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AttendanceService {

  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  getTodayLessonsForTeacher(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/today-lessons`, { headers });
  }
}
