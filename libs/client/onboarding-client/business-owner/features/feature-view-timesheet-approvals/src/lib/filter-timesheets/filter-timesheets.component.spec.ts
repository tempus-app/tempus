import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTimesheetsComponent } from './filter-timesheets.component';

describe('FilterTimesheetssComponent', () => {
	let component: FilterTimesheetsComponent;
	let fixture: ComponentFixture<FilterTimesheetsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FilterTimesheetsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FilterTimesheetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
