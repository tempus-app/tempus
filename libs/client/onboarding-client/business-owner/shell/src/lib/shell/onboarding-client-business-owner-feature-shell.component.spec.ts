import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOnwerShellComponent } from './onboarding-client-business-owner-feature-shellcomponent';

describe('MyInfoOneComponent', () => {
	let component: BusinessOnwerShellComponent;
	let fixture: ComponentFixture<BusinessOnwerShellComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BusinessOnwerShellComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BusinessOnwerShellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
