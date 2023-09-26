import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCostBillingReportsComponent } from './view-cost-billing-reports.component';

describe('ViewCostBillingReportsComponent', () => {
  let component: ViewCostBillingReportsComponent;
  let fixture: ComponentFixture<ViewCostBillingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCostBillingReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCostBillingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
