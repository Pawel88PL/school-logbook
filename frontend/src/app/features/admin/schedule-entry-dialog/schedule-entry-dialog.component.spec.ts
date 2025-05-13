import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEntryDialogComponent } from './schedule-entry-dialog.component';

describe('ScheduleEntryDialogComponent', () => {
  let component: ScheduleEntryDialogComponent;
  let fixture: ComponentFixture<ScheduleEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleEntryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
