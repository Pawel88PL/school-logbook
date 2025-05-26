import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { adminGuard } from './core/guards/admin.guard';
import { studentGuard } from './core/guards/student.guard';
import { teacherGuard } from './core/guards/teacher.guard';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ClassAddComponent } from './features/admin/class-add/class-add.component';
import { ClassEditComponent } from './features/admin/class-edit/class-edit.component';
import { ClassListComponent } from './features/admin/class-list/class-list.component';
import { ScheduleEditComponent } from './features/admin/schedule-edit/schedule-edit.component';
import { ScheduleListComponent } from './features/admin/schedule-list/schedule-list.component';
import { SubjectAddComponent } from './features/admin/subject-add/subject-add.component';
import { SubjectEditComponent } from './features/admin/subject-edit/subject-edit.component';
import { SubjectListComponent } from './features/admin/subject-list/subject-list.component';
import { UserAddComponent } from './features/admin/user-add/user-add.component';
import { UserEditComponent } from './features/admin/user-edit/user-edit.component';
import { UserListComponent } from './features/admin/user-list/user-list.component';

import { TeacherLayoutComponent } from './layout/teacher-layout/teacher-layout.component';
import { GradeAssignComponent } from './features/teacher/grade-assign/grade-assign.component';
import { GradePreviewComponent } from './features/teacher/grade-preview/grade-preview.component';
import { TeacherAttendanceComponent } from './features/teacher/teacher-attendance/teacher-attendance.component';
import { TeacherScheduleComponent } from './features/teacher/teacher-schedule/teacher-schedule.component';
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
            { path: 'class-add', component: ClassAddComponent, data: { title: 'Dziennik - dodaj klasę' } },
            { path: 'class-edit/:id', component: ClassEditComponent, data: { title: 'Dziennik - edytuj klasę' } },
            { path: 'classes', component: ClassListComponent, data: { title: 'Dziennik - klasy' } },
            { path: 'schedule-edit/:id', component: ScheduleEditComponent, data: { title: 'Dziennik - edytuj plan lekcji' } },
            { path: 'schedules', component: ScheduleListComponent, data: { title: 'Dziennik - plany lekcji' } },
            { path: 'subject-add', component: SubjectAddComponent, data: { title: 'Dziennik - dodaj przedmiot' } },
            { path: 'subject-edit/:id', component: SubjectEditComponent, data: { title: 'Dziennik - edytuj przedmiot' } },
            { path: 'subjects', component: SubjectListComponent, data: { title: 'Dziennik - przedmioty' } },
            { path: 'user-add', component: UserAddComponent, data: { title: 'Dziennik - dodaj użytkownika' } },
            { path: 'user-edit/:id', component: UserEditComponent, data: { title: 'Dziennik - edytuj użytkownika' } },
            { path: 'users', component: UserListComponent, data: { title: 'Dziennik - użytkownicy' } },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    {
        path: 'teacher',
        component: TeacherLayoutComponent,
        canActivate: [teacherGuard],
        children: [
            { path: 'attendance', component: TeacherAttendanceComponent, data: { title: 'Dziennik - frekwencja' } },
            { path: 'classes', component: TeacherClassesComponent, data: { title: 'Dziennik - klasy' } },
            { path: 'grade-assign', component: GradeAssignComponent, data: { title: 'Dziennik - przypisz ocenę' } },
            { path: 'grade-preview', component: GradePreviewComponent, data: { title: 'Dziennik - podgląd ocen' } },
            { path: 'schedule', component: TeacherScheduleComponent, data: { title: 'Dziennik - plan lekcji' } },
            { path: '', redirectTo: 'schedule', pathMatch: 'full' }
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