import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimesheetComponent } from './edit-timesheet.component';

describe('EditTimesheetComponent', () => {
  let component: EditTimesheetComponent;
  let fixture: ComponentFixture<EditTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
