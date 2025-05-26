import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradePreviewComponent } from './grade-preview.component';

describe('GradePreviewComponent', () => {
  let component: GradePreviewComponent;
  let fixture: ComponentFixture<GradePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
