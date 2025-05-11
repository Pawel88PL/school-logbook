import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-edit',
  imports: [],
  templateUrl: './schedule-edit.component.html',
  styleUrl: './schedule-edit.component.css'
})

export class ScheduleEditComponent implements OnInit{

  classId: number | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.captureURLparameters();
  }

  captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.classId = params['id'];
    });
  }
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface ScheduleCell {
  subjectId: number | null;
  teacherId: number | null;
}

type ScheduleGrid = {
  [day in DayOfWeek]: ScheduleCell[];
};