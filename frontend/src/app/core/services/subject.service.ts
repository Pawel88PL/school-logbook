import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { Observable } from 'rxjs';
import { ClassModel } from '../models/class-model';
import { PagedRequestParams } from '../models/paged-request-params';
import { SubjectAddModel } from '../models/subject-model';

@Injectable({
  providedIn: 'root'
})

export class SubjectService {

  private apiUrl = `${environment.apiUrl}/subject`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  addSubject(data: SubjectAddModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add`, data, { headers });
  }

  deleteClass(id: number): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }

  getClassById(id: number): Observable<ClassModel> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ClassModel>(`${this.apiUrl}/get/${id}`, { headers });
  }

  getClassesPaged(request: PagedRequestParams): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize)
      .set('sortColumn', request.sortColumn)
      .set('sortDirection', request.sortDirection)

    return this.http.get(`${this.apiUrl}/paged`, { headers, params });
  }

  updateClass(data: ClassModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/update`, data, { headers });
  }
}
