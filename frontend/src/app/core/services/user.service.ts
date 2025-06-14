import { Injectable } from '@angular/core';
import { PagedRequestParams } from '../models/paged-request-params';
import { Observable } from 'rxjs';
import { UpdateUserModel, User, UserAddModel } from '../models/user-model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  addUser(userData: UserAddModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add`, userData, { headers });
  }

  deleteUser(id: string): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }

  getLoggedUser(): Observable<User> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/logged-user`, { headers });
  }

  getUserById(userId: string): Observable<User> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/get-user/${userId}`, { headers });
  }

  getUsersPaged(request: PagedRequestParams): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize)
      .set('sortColumn', request.sortColumn)
      .set('sortDirection', request.sortDirection)
      .set('searchQuery', request.searchQuery ?? '');

    return this.http.get(`${this.apiUrl}/paged`, { headers, params });
  }

  getRoles(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/roles`, { headers });
  }

  updateUser(userData: UpdateUserModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/update`, userData, { headers });
  }
}