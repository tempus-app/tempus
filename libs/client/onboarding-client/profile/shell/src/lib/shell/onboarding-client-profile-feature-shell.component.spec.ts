import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShellComponent } from './onboarding-client-profile-feature-shell.component';

describe('MyInfoOneComponent', () => {
	let component: ProfileShellComponent;
	let fixture: ComponentFixture<ProfileShellComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProfileShellComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileShellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
