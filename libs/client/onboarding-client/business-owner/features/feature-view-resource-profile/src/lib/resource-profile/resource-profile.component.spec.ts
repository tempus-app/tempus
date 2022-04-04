import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceProfileComponent } from './resource-profile.component';

describe('ResourceProfileComponent', () => {
  let component: ResourceProfileComponent;
  let fixture: ComponentFixture<ResourceProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
