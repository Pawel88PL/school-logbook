import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { adminGuard } from './core/guards/admin.guard';
import { studentGuard } from './core/guards/student.guard';
import { teacherGuard } from './core/guards/teacher.guard';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UserListComponent } from './features/admin/user-list/user-list.component';
import { ClassListComponent } from './features/admin/class-list/class-list.component';
import { ScheduleComponent } from './features/admin/schedule/schedule.component';

import { TeacherLayoutComponent } from './layout/teacher-layout/teacher-layout.component';
import { AttendanceComponent } from './features/teacher/attendance/attendance.component';
import { TeacherClassesComponent } from './features/teacher/teacher-classes/teacher-classes.component';

import { StudentLayoutComponent } from './layout/student-layout/student-layout.component';
import { StudentScheduleComponent } from './features/student/student-schedule/student-schedule.component';
import { StudentAttendanceComponent } from './features/student/student-attendance/student-attendance.component';

import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: 'users', component: UserListComponent },
            { path: 'classes', component: ClassListComponent },
            { path: 'schedule', component: ScheduleComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: 'teacher',
        component: TeacherLayoutComponent,
        canActivate: [teacherGuard],
        children: [
            { path: 'attendance', component: AttendanceComponent },
            { path: 'classes', component: TeacherClassesComponent },
            { path: '', redirectTo: 'classes', pathMatch: 'full' }
        ]
    },
    {
        path: 'student',
        component: StudentLayoutComponent,
        canActivate: [studentGuard],
        children: [
            { path: 'schedule', component: StudentScheduleComponent },
            { path: 'attendance', component: StudentAttendanceComponent },
            { path: '', redirectTo: 'schedule', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }