import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { GradeCreateModel, GradeModel } from '../models/grade-model';
import { SubjectWithTeachersModel } from '../models/subject-teacher.model';
import { Student } from '../models/student-model';
import { SubjectWithClass } from '../models/subject-class-model';
import { PagedRequestParams } from '../models/paged-request-params';

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

  getGradesForTeacherPaged(request: PagedRequestParams): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize)
      .set('sortColumn', request.sortColumn)
      .set('sortDirection', request.sortDirection)
      .set('searchQuery', request.searchQuery ?? '');

    return this.http.get(`${this.apiUrl}/teacher/paged`, { headers, params });
  }

  getSubjectsForCurrentTeacher(): Observable<SubjectWithClass[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SubjectWithClass[]>(`${this.apiUrl}/subjects`, { headers });
  }

  getStudentsForSubjectAndClass(subjectId: number, classId: number): Observable<Student[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Student[]>(`${this.apiUrl}/students/${subjectId}/${classId}`, { headers });
  }
}