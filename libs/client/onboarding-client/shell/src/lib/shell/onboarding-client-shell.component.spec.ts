import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingClientShellComponent } from './onboarding-client-shell.component';

describe('MyInfoOneComponent', () => {
	let component: OnboardingClientShellComponent;
	let fixture: ComponentFixture<OnboardingClientShellComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OnboardingClientShellComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OnboardingClientShellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
