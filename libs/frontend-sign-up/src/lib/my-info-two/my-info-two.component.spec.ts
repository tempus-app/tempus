import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInfoTwoComponent } from './my-info-two.component';

describe('MyInfoTwoComponent', () => {
  let component: MyInfoTwoComponent;
  let fixture: ComponentFixture<MyInfoTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInfoTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInfoTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
