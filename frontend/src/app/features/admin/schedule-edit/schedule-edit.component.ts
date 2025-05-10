import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule-edit',
  imports: [],
  templateUrl: './schedule-edit.component.html',
  styleUrl: './schedule-edit.component.css'
})

export class ScheduleEditComponent {


}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface ScheduleCell {
  subjectId: number | null;
  teacherId: number | null;
}

type ScheduleGrid = {
  [day in DayOfWeek]: ScheduleCell[];
};