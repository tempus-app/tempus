/* eslint-disable */
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	Injectable,
	VERSION,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';

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

	firstDayOfCurrentMonth: string | undefined;


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

	// Edit and submit timesheet prefix
	editViewTimesheetPrefix = 'onboardingClient.editViewTimesheet.';

	rowAmount = 1;

	// ---------------------------------------------------------------------------

	InputType = InputType;

	numberTimesheetSections: number[] = [0];

	@Input() timesheet: ICreateTimesheetDto = {
		projectId: 0,
		resourceId: 0,
		supervisorId: 0,
		weekStartDate: new Date(),
		weekEndDate: new Date(),
		approvedBySupervisor: false,
		approvedByClient: false,
		resourceComment: '',
		supervisorComment: '',
		clientRepresentativeComment: '',
		audited: false,
		billed: false,
		mondayHours: 0,
		tuesdayHours: 0,
		wednesdayHours: 0,
		thursdayHours: 0,
		fridayHours: 0,
		saturdayHours: 0,
		sundayHours: 0,
	};

	@Input() projectName = '';

	@Output() formGroup = new EventEmitter();

	@Output() multiTimesheets = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	userId = 0;

	projectOptions: { id: number; val: string }[] = [];

	sundayDate = ''; // sunday

	saturdayDate = ''; // saturday

	mondayDate = ''; // monday

	tuesdayDate = ''; // tuesday

	wednesdayDate = ''; // wednesday

	thursdayDate = ''; // thursday

	fridayDate = ''; // friday

	totalHours = 0; // Total hours

	isLoadingStoreData = false;

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

	myInfoForm = this.fb.group({
		timesheets: this.fb.array([
			this.fb.group({
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
			}),
		]),
	});

	totalHoursForm = new FormControl();

	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		// Obtain the names of the projects the resource is assigned and the name of the resource
		this.resourceService.getResourceInformation().subscribe(data => {
			this.projectOptions = data.projectResources.map(proj => {
				return { id: proj.project.id, val: proj.project.name };
			});
			this.userId = data.id;
		});

		if (this.route.snapshot.paramMap.get('id')) {
			this.loadStoreData();
			this.formGroup.emit(this.timesheetForm);
		} else {
			this.multiTimesheets.emit(this.myInfoForm);
		}

		const currentDate = new Date();
        this.firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            .toISOString()
			.split('T')[0]; // format as 'YYYY-MM-DD'

		console.log(this.firstDayOfCurrentMonth);
	}

	// Load the store data
	loadStoreData() {
		// Set column names for each day of the week in the date range

		// Get start date and end date and store in variables
		const startDateRange = this.timesheet.weekStartDate!;
		const endDateRange = this.timesheet.weekEndDate!;

		// Variable for current date
		let currentDate = new Date(startDateRange);

		// Set all the column variables
		this.sundayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.mondayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.tuesdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.wednesdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.thursdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.fridayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.saturdayDate = currentDate.toLocaleString();

		// Calculate the total hours
		this.totalHours =
			(this.timesheet.mondayHours ?? 0) +
			(this.timesheet.tuesdayHours ?? 0) +
			(this.timesheet.wednesdayHours ?? 0) +
			(this.timesheet.thursdayHours ?? 0) +
			(this.timesheet.fridayHours ?? 0) +
			(this.timesheet.saturdayHours ?? 0) +
			(this.timesheet.sundayHours ?? 0);

		this.from = startDateRange;
		this.thru = endDateRange;
		this.timesheetForm.patchValue({
			startDate: this.timesheet.weekStartDate,
			endDate: this.timesheet.weekEndDate,
			project: this.projectName,
			comments: this.timesheet.resourceComment,
			sunday: this.timesheet.sundayHours,
			monday: this.timesheet.mondayHours,
			tuesday: this.timesheet.tuesdayHours,
			wednesday: this.timesheet.wednesdayHours,
			thursday: this.timesheet.thursdayHours,
			friday: this.timesheet.fridayHours,
			saturday: this.timesheet.saturdayHours,
		});

		this.totalHoursForm.setValue(this.totalHours);

		this.isLoadingStoreData = true;
	}

	// Timesheet form controls
	get timesheets() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['timesheets'] as FormArray;
	}

	addRow() {
		const newTimesheetTableRow = {
			position: (this.rowAmount += 1),
			project: '',
			sunday: '',
			monday: '',
			tuesday: '',
			wednesday: '',
			thursday: '',
			friday: '',
			saturday: '',
			total: '',
		};

		if (this.numberTimesheetSections.length === 0) {
			this.numberTimesheetSections.push(0);
		} else {
			const lastElement = this.numberTimesheetSections[this.numberTimesheetSections.length - 1];
			this.numberTimesheetSections.push(lastElement + 1);
		}

		const timesheet = this.fb.group({
			startDate: [this.from, Validators.required],
			endDate: [this.thru, Validators.required],
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

		this.timesheets.push(timesheet);

		console.log(this.timesheets);

		this.dataSource = [...this.dataSource, newTimesheetTableRow];
	}

	removeTimesheetSection(index: number) {
		this.numberTimesheetSections.splice(index, 1);
		this.dataSource.splice(index, 1);
		this.timesheets.removeAt(index);
		this.dataSource = [...this.dataSource];
	}
}
