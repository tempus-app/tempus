import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSupervisorModalComponent } from './assign-supervisor-modal.component';

describe('AssignSupervisorModalComponent', () => {
  let component: AssignSupervisorModalComponent;
  let fixture: ComponentFixture<AssignSupervisorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSupervisorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSupervisorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
