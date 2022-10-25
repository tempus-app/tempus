import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationDisplayComponent } from './personal-information-display.component';

describe('PersonalInformationDisplayComponent', () => {
	let component: PersonalInformationDisplayComponent;
	let fixture: ComponentFixture<PersonalInformationDisplayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PersonalInformationDisplayComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PersonalInformationDisplayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
