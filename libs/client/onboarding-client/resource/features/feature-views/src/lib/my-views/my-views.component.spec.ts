import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewsComponent } from './my-views.component';

describe('MyViewsComponent', () => {
	let component: MyViewsComponent;
	let fixture: ComponentFixture<MyViewsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MyViewsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MyViewsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
