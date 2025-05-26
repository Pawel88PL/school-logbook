import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAssignComponent } from './grade-assign.component';

describe('GradeAssignComponent', () => {
  let component: GradeAssignComponent;
  let fixture: ComponentFixture<GradeAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
