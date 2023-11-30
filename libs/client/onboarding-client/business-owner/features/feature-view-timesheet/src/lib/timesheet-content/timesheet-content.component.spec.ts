import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetContentComponent } from './timesheet-content.component';

describe('TimesheetContentComponent', () => {
  let component: TimesheetContentComponent;
  let fixture: ComponentFixture<TimesheetContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
