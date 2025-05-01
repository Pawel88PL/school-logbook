import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from '../auth/jwt.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Student } from '../models/student-model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/student`;

  constructor(
    private jwtService: JwtService,
    private http: HttpClient
  ) { }

  getStudents(): Observable<Student[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Student[]>(`${this.apiUrl}/all`, { headers });
  }
}
