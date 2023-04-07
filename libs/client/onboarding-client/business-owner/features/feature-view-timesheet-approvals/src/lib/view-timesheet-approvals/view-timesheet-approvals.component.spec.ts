import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimesheetApprovalsComponent } from './view-timesheet-approvals.component';

describe('ViewTimesheetApprovalsComponent', () => {
  let component: ViewTimesheetApprovalsComponent;
  let fixture: ComponentFixture<ViewTimesheetApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTimesheetApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTimesheetApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
