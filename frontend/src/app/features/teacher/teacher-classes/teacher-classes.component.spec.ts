import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassesComponent } from './teacher-classes.component';

describe('TeacherClassesComponent', () => {
  let component: TeacherClassesComponent;
  let fixture: ComponentFixture<TeacherClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
