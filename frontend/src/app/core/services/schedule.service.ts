import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { ScheduleForClassModel } from '../models/class-schedule-model';
import { SubjectWithTeachersModel } from '../models/subject-teacher.model';
import { ScheduleEntryModel } from '../models/schedule-model';
import { TeacherScheduleEntry } from '../models/teacher-schedule-model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = `${environment.apiUrl}/schedule`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  addScheduleEntry(entry: ScheduleEntryModel): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add-entry`, entry, { headers });
  }

  getClassesWithSchedule(): Observable<any[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/classes-with-schedule`, { headers });
  }

  getScheduleForClass(classId: number): Observable<ScheduleForClassModel> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ScheduleForClassModel>(`${this.apiUrl}/class/${classId}`, { headers });
  }

  getScheduleForTeacher(teacherId: string): Observable<TeacherScheduleEntry[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TeacherScheduleEntry[]>(`${this.apiUrl}/teacher/${teacherId}`, { headers });
  }

  getSubjectsForClass(classId: number): Observable<SubjectWithTeachersModel[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SubjectWithTeachersModel[]>(`${this.apiUrl}/class/${classId}/subjects`, { headers });
  }
}
