import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
	it('should display input fields when adding fields', () => {
		fixture.debugElement.query(By.css('#theid'));
	});

	it('should display input fields when adding fields', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		button.click();
		fixture.whenStable().then(() => {
			expect(fixture.debugElement.query(By.css('certification-input-container'))).toHaveBeenCalled();
		});
	});

	it('should display input fields when adding fields', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		button.click();
		fixture.whenStable().then(() => {
			expect(fixture.debugElement.query(By.css('certification-input-container'))).toHaveBeenCalled();
		});
	});
});
