import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { GradeCreateModel, GradeModel } from '../models/grade-model';

@Injectable({
  providedIn: 'root'
})

export class GradeService {

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  private apiUrl = `${environment.apiUrl}/grade`;

  addGrade(grade: GradeCreateModel): Observable<GradeModel> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<GradeModel>(`${this.apiUrl}/add`, grade, { headers });
  }
}