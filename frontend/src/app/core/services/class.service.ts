import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { Observable } from 'rxjs';
import { ClassAddModel, ClassModel } from '../models/class-model';

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
}
