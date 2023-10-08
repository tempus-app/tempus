import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostReportsComponent } from './cost-reports.component';

describe('CostReportsComponent', () => {
  let component: CostReportsComponent;
  let fixture: ComponentFixture<CostReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
