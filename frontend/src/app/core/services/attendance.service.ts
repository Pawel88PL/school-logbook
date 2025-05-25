import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../auth/jwt.service';
import { Observable } from 'rxjs';
import { LessonForAttendanceModel, StudentForAttendanceModel } from '../models/attendance-model';

@Injectable({
  providedIn: 'root'
})

export class AttendanceService {

  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  getStudentsForSchedule(scheduleId: number): Observable<StudentForAttendanceModel[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<StudentForAttendanceModel[]>(`${this.apiUrl}/students/${scheduleId}`, { headers });
  }

  getTodayLessonsForTeacher(): Observable<LessonForAttendanceModel[]> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<LessonForAttendanceModel[]>(`${this.apiUrl}/today-lessons`, { headers });
  }

  saveAttendance(scheduleId: number, attendanceList: { studentId: number, status: number }[]): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/save/${scheduleId}`, attendanceList, { headers });
  }
}
