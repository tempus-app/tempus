import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInfoThreeComponent } from './my-info-three.component';

describe('MyInfoThreeComponent', () => {
	let component: MyInfoThreeComponent;
	let fixture: ComponentFixture<MyInfoThreeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MyInfoThreeComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MyInfoThreeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
