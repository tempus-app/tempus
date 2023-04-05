/* eslint-disable max-classes-per-file */
import { Component, EventEmitter, OnDestroy, Output, Injectable, Input, OnInit, VERSION } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
	DateRange,
	MatDateRangePicker,
	MatDateRangeSelectionStrategy,
	MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientState,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { splitStringIntoBulletPoints } from '@tempus/client/shared/util';
import { ProjectResource } from '@tempus/shared-domain';

@Injectable()
export class WeekSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
	constructor(private _dateAdapter: DateAdapter<string>) {}

	selectionFinished(date: string | null): DateRange<string> {
		return this._createWeekRange(date);
	}

	createPreview(activeDate: string | null): DateRange<string> {
		return this._createWeekRange(activeDate);
	}

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
		monday: '7.5',
		tuesday: '',
		wednesday: '',
		thursday: '7.5',
		friday: '7.5',
		saturday: '',
		total: 22.5,
	},
];

export interface TableOfContents {
	position: number;
	project: string;
	total: number;
	sunday: string;
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
}

@Component({
	selector: 'tempus-edit-view-timesheet',
	templateUrl: './edit-view-timesheet.component.html',
	styleUrls: ['./edit-view-timesheet.component.scss'],
	providers: [
		OnboardingClientResourceService,
		{
			provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
			useClass: WeekSelectionStrategy,
		},
	],
})
export class EditViewTimesheetComponent implements OnDestroy {
	@Input() from!: Date;

	@Input() thru!: Date;

	prefix = 'onboardingResourceTimesheet';

	startDate2 = ''; // sunday

	endDate2 = ''; // saturday

	startDatePlusOne2 = ''; // monday

	startDatePlusTwo2 = ''; // tuesday

	startDatePlusThree2 = ''; // wednesday

	startDatePlusFour2 = ''; // thursday

	startDatePlusFive2 = ''; // friday

	projectOptions: { id: number; val: string }[] = [];

	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private store: Store<OnboardingClientState>,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	changed(picker: MatDateRangePicker<any>) {
		console.log('changed');
		console.log(this.from);
		console.log(this.thru);
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

	/*
  startDate: Date = new Date(this.from);
  startDate_string: string = this.startDate.toLocaleString();
  endDate: Date = new Date(this.thru);
  endDate_string: string = this.endDate.toLocaleString(); */

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

	formatsDateTest: string[] = ['fullDate'];

	dateNow: Date = new Date();

	ButtonType = ButtonType;

	@Output()
	closeEditViewClicked = new EventEmitter();

	@Output()
	submitClicked = new EventEmitter();

	destroyed$ = new Subject<void>();

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(data => {
			this.projectOptions = data.projectResources.map(proj => {
				return { id: proj.id, val: proj.project.name };
			});
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
