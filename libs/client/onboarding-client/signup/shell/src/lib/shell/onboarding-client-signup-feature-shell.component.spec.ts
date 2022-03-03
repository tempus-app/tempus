import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupShellComponent } from './onboarding-client-signup-feature-shell.component';

describe('MyInfoOneComponent', () => {
	let component: SignupShellComponent;
	let fixture: ComponentFixture<SignupShellComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SignupShellComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SignupShellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
