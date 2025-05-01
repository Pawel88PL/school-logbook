import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { adminGuard } from './core/guards/admin.guard';
import { studentGuard } from './core/guards/student.guard';
import { teacherGuard } from './core/guards/teacher.guard';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ClassListComponent } from './features/admin/class-list/class-list.component';
import { SubjectListComponent } from './features/admin/subject-list/subject-list.component';
import { UserAddComponent } from './features/admin/user-add/user-add.component';
import { UserListComponent } from './features/admin/user-list/user-list.component';

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
            { path: 'classes', component: ClassListComponent, data: { title: 'Dziennik - klasy' } },
            { path: 'subjects', component: SubjectListComponent, data: { title: 'Dziennik - przedmioty' } },
            { path: 'user-add', component: UserAddComponent, data: { title: 'Dziennik - dodaj użytkownika' } },
            { path: 'users', component: UserListComponent, data: { title: 'Dziennik - użytkownicy' } },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: 'teacher',
        component: TeacherLayoutComponent,
        canActivate: [teacherGuard],
        children: [
            { path: 'attendance', component: AttendanceComponent, data: { title: 'Dziennik - frekwencja' } },
            { path: 'classes', component: TeacherClassesComponent, data: { title: 'Dziennik - klasy' } },
            { path: '', redirectTo: 'classes', pathMatch: 'full' }
        ]
    },
    {
        path: 'student',
        component: StudentLayoutComponent,
        canActivate: [studentGuard],
        children: [
            { path: 'schedule', component: StudentScheduleComponent, data: { title: 'Dziennik - plan lekcji' } },
            { path: 'attendance', component: StudentAttendanceComponent, data: { title: 'Dziennik - frekwencja' } },
            { path: '', redirectTo: 'schedule', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: 'Dziennik - logowanie' } },
    { path: 'home', component: HomeComponent, data: { title: 'Dziennik lekcyjny' } },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }