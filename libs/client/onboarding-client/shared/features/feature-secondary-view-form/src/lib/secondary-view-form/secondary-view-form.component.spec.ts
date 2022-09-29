import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryViewFormComponent } from './secondary-view-form.component';

describe('SecondaryViewFormComponent', () => {
	let component: SecondaryViewFormComponent;
	let fixture: ComponentFixture<SecondaryViewFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SecondaryViewFormComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SecondaryViewFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
