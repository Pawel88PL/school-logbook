import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { Observable } from 'rxjs';
import { ClassAddModel, ClassModel } from '../models/class-model';
import { PagedRequestParams } from '../models/paged-request-params';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private apiUrl = `${environment.apiUrl}/class`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  addClass(data: ClassAddModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add`, data, { headers });
  }

  deleteClass(id: number): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
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
}