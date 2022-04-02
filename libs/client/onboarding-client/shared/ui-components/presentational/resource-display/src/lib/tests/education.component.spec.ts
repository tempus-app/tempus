import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationComponent } from '../components/education/education.component';

describe('EducationComponent', () => {
	let component: EducationComponent;
	let fixture: ComponentFixture<EducationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EducationComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EducationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
