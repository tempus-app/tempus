import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInfoOneComponent } from './my-info-one.component';

describe('MyInfoOneComponent', () => {
	let component: MyInfoOneComponent;
	let fixture: ComponentFixture<MyInfoOneComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MyInfoOneComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MyInfoOneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
