import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewTimesheetComponent } from './edit-view-timesheet.component';

describe('EditViewTimesheetComponent', () => {
  let component: EditViewTimesheetComponent;
  let fixture: ComponentFixture<EditViewTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditViewTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
