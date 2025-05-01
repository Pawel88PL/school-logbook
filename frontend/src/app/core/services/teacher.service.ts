import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher-model';
import { Observable } from 'rxjs';
import { JwtService } from '../auth/jwt.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TeacherService {

  private apiUrl = `${environment.apiUrl}/teacher`;

  constructor(
    private jwtService: JwtService,
    private http: HttpClient
  ) { }

  getTeachers(): Observable<Teacher[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Teacher[]>(`${this.apiUrl}/all`, { headers });
  }
}