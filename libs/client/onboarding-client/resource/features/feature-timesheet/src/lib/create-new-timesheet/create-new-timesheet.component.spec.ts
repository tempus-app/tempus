import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTimesheetComponent } from './create-new-timesheet.component';

describe('CreateNewTimesheetComponent', () => {
  let component: CreateNewTimesheetComponent;
  let fixture: ComponentFixture<CreateNewTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
