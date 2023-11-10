/* eslint-disable */
import { Component, EventEmitter, Input, OnInit, Output, Injectable, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	DateRange,
	MatDateRangePicker,
	MatDateRangeSelectionStrategy,
	MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ICreateTimesheetDto } from '@tempus/shared-domain';
import { DateAdapter } from '@angular/material/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';

@Injectable()

// Class for the week selection strategy
export class WeekSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
	constructor(private _dateAdapter: DateAdapter<string>) {}

	selectionFinished(date: string | null): DateRange<string> {
		return this._createWeekRange(date);
	}

	createPreview(activeDate: string | null): DateRange<string> {
		return this._createWeekRange(activeDate);
	}

	// Function to restrict the input to numeric characters
	restrictToNumeric(event: any) {
		const inputElement: HTMLInputElement = event.target;
		inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
	}

	// Create the week range
	private _createWeekRange(date: string | null): DateRange<string> {
		if (date) {
			const theDate = new Date(date);
			const start = new Date(
				theDate.setDate(theDate.getDate() - theDate.getDay() + (theDate.getDay() == -1 ? -7 : 0)),
			);
			const end = new Date(
				theDate.setDate(theDate.getDate() - theDate.getDay() + (theDate.getDay() == -1 ? -7 : 0) + 6),
			);
			return new DateRange<any>(start, end);
		}

		return new DateRange<string>(null, null);
	}
}

const ELEMENT_DATA: TableOfContents[] = [
	{
		position: 1,
		project: 'Project 1',
		sunday: '',
		monday: '',
		tuesday: '',
		wednesday: '',
		thursday: '',
		friday: '',
		saturday: '',
		total: '',
	},
];

// Table of contents interface
export interface TableOfContents {
	position: number;
	project: string;
	total: string;
	sunday: string;
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
}

@Component({
	selector: 'tempus-resource-info-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
	providers: [
		OnboardingClientResourceService,
		{
			provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
			useClass: WeekSelectionStrategy,
		},
	],
})
export class TimesheetComponent implements OnInit {
	@Input() from!: Date;

	@Input() thru!: Date;

	startDate2 = ''; // sunday

	endDate2 = ''; // saturday

	startDatePlusOne2 = ''; // monday

	startDatePlusTwo2 = ''; // tuesday

	startDatePlusThree2 = ''; // wednesday

	startDatePlusFour2 = ''; // thursday

	startDatePlusFive2 = ''; // friday

	// Function to restrict input to numeric characters for a specific input field
	restrictInputToNumeric(event: any, min: number, max: number) {
		const inputElement: HTMLInputElement = event.target;
		let numericValue = +inputElement.value; // Convert the input value to a number
		if (isNaN(numericValue)) {
			numericValue = 0; // Set to a default value if not a number
		}

		// Ensure the value is within the specified range
		if (numericValue < min) {
			numericValue = min;
		} else if (numericValue > max) {
			numericValue = max;
		}

		inputElement.value = numericValue.toString(); // Update the input value
	}

	// After a date range is selected this function is executed
	changed(picker: MatDateRangePicker<any>) {
		// Dynamically display the dates in each of the timesheet table columns

		// Sunday
		const startDate: Date = new Date(this.from);
		const startDate_string: string = startDate.toLocaleString();

		// Saturday
		const endDate: Date = new Date(this.thru);
		const endDate_string: string = endDate.toLocaleString();

		// Monday
		const startDatePlusOne = startDate.setDate(startDate.getDate() + 1);
		const startDatePlusOne2 = new Date(startDatePlusOne);
		const startDatePlusOne_string: string = startDatePlusOne2.toLocaleString();

		// Tuesday
		const startDatePlusTwo = startDate.setDate(startDate.getDate() + 1);
		const startDatePlusTwo2 = new Date(startDatePlusTwo);
		const startDatePlusTwo_string: string = startDatePlusTwo2.toLocaleString();

		// Wednesday
		const startDatePlusThree = startDate.setDate(startDate.getDate() + 1);
		const startDatePlusThree2 = new Date(startDatePlusThree);
		const startDatePlusThree_string: string = startDatePlusThree2.toLocaleString();

		// Thursday
		const startDatePlusFour = startDate.setDate(startDate.getDate() + 1);
		const startDatePlusFour2 = new Date(startDatePlusFour);
		const startDatePlusFour_string: string = startDatePlusFour2.toLocaleString();

		// Friday
		const startDatePlusFive = startDate.setDate(startDate.getDate() + 1);
		const startDatePlusFive2 = new Date(startDatePlusFive);
		const startDatePlusFive_string: string = startDatePlusFive2.toLocaleString();

		// returning days values to string
		this.startDate2 = startDate_string; // sunday
		this.endDate2 = endDate_string; // saturday
		this.startDatePlusOne2 = startDatePlusOne_string; // monday
		this.startDatePlusTwo2 = startDatePlusTwo_string; // tuesday
		this.startDatePlusThree2 = startDatePlusThree_string; // wednesday
		this.startDatePlusFour2 = startDatePlusFour_string; // thursday
		this.startDatePlusFive2 = startDatePlusFive_string; // friday
	}

	// Columns for the timesheet table
	displayedColumns: string[] = [
		'position',
		'project',
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'total',
	];

	dataSource = ELEMENT_DATA;

	// created dummy data for days of the week in table
	version = VERSION.full;

	// Today's date
	dateNow: Date = new Date();

	// Common prefix
	commonPrefix = 'onboardingClient.input.common.';

	// Timesheet prefix
	timesheetPrefix = 'onboardingClient.input.timesheet.';

	// ---------------------------------------------------------------------------

	InputType = InputType;

	numberTimesheetSections: number[] = [0];

	@Input() timesheetsArray: Array<ICreateTimesheetDto> = [];

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	userId = 0;

	projectOptions: { id: number; val: string }[] = [];

	// Create timesheet form builder group
	timesheetForm: FormGroup = this.fb.group({
		startDate: ['', Validators.required],
		endDate: ['', Validators.required],
		project: ['', Validators.required],
		comments: ['', Validators.required],
		sunday: ['', Validators.required],
		monday: ['', Validators.required],
		tuesday: ['', Validators.required],
		wednesday: ['', Validators.required],
		thursday: ['', Validators.required],
		friday: ['', Validators.required],
		saturday: ['', Validators.required],
	});

	constructor(private fb: FormBuilder, private resourceService: OnboardingClientResourceService) {}

	ngOnInit(): void {
		// Obtain the names of the projects the resource is assigned and the name of the resource
		this.resourceService.getResourceInformation().subscribe(data => {
			this.projectOptions = data.projectResources.map(proj => {
				return { id: proj.project.id, val: proj.project.name };
			});
			this.userId = data.id;
		});

		this.formGroup.emit(this.timesheetForm);
	}

	// Timesheet form controls
	get timesheets() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.timesheetForm.controls['timesheets'] as FormGroup;
	}

	// Load the store data
	loadStoreData() {}
}
