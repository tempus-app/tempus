/* eslint-disable max-classes-per-file */
import { Component, EventEmitter, OnDestroy, Output, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
import { ICreateTimesheetDto, ProjectResource, Timesheet } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-edit-view-timesheet',
	templateUrl: './edit-view-timesheet.component.html',
	styleUrls: ['./edit-view-timesheet.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class EditViewTimesheetComponent implements OnDestroy {
	// Form group for editing timesheet
	timesheetForm = this.fb.group({});

	// Form group for new timesheets
	timesheetsForm = this.fb.group({});

	prefix = 'onboardingResourceTimesheet';

	editViewTimesheetPrefix = 'onboardingClient.editViewTimesheet.';

	dataLoaded = false;

	timesheet: ICreateTimesheetDto = {
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

	currentTimesheetId = 0;

	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private store: Store<OnboardingClientState>,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
		private http: HttpClient,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ButtonType = ButtonType;

	@Output()
	closeEditTimesheetClicked = new EventEmitter();

	@Output()
	submitClicked = new EventEmitter();

	userId = 0;

	destroyed$ = new Subject<void>();

	projectName = '';

	timesheetWeek = '';

	isNewTimesheet = false;

	setFormDataFromTimesheet(timesheet: Timesheet) {
		this.currentTimesheetId = timesheet.id;
		this.timesheet = timesheet;
		this.projectName = timesheet.project.name;

		const startDate = new Date(timesheet.weekStartDate).toLocaleString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
		const endDate = new Date(timesheet.weekEndDate).toLocaleString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});

		this.timesheetWeek = `${startDate} - ${endDate}`;

		this.dataLoaded = true;
	}

	// Generate new timesheet
	generateNewTimesheet() {
		const timesheetsArray = this.timesheetsForm.controls.timesheets as FormArray;

		const timesheetsDto: ICreateTimesheetDto[] = [];

		for (let i = 0; i < timesheetsArray?.length; i++) {
			const timesheet: ICreateTimesheetDto = {
				projectId: (timesheetsArray?.at(i) as FormGroup).get('project')?.value,
				resourceId: this.userId,
				weekStartDate: (timesheetsArray?.at(i) as FormGroup).get('startDate')?.value,
				weekEndDate: (timesheetsArray?.at(i) as FormGroup).get('endDate')?.value,
				approvedBySupervisor: false,
				approvedByClient: false,
				resourceComment: (timesheetsArray?.at(i) as FormGroup).get('comments')?.value,
				supervisorComment: '',
				clientRepresentativeComment: '',
				audited: false,
				billed: false,
				mondayHours: (timesheetsArray?.at(i) as FormGroup).get('monday')?.value,
				tuesdayHours: (timesheetsArray?.at(i) as FormGroup).get('tuesday')?.value,
				wednesdayHours: (timesheetsArray?.at(i) as FormGroup).get('wednesday')?.value,
				thursdayHours: (timesheetsArray?.at(i) as FormGroup).get('thursday')?.value,
				fridayHours: (timesheetsArray?.at(i) as FormGroup).get('friday')?.value,
				saturdayHours: (timesheetsArray?.at(i) as FormGroup).get('saturday')?.value,
				sundayHours: (timesheetsArray?.at(i) as FormGroup).get('sunday')?.value,
			};
			timesheetsDto.push(timesheet);
		}

		return timesheetsDto as ICreateTimesheetDto[];
	}

	editTimesheet() {
		return {
			projectId: this.timesheetForm.get('project')?.value,
			resourceId: this.userId,
			weekStartDate: this.timesheetForm.get('startDate')?.value,
			weekEndDate: this.timesheetForm.get('endDate')?.value,
			approvedBySupervisor: false,
			approvedByClient: false,
			resourceComment: this.timesheetForm.get('comments')?.value,
			supervisorComment: '',
			clientRepresentativeComment: '',
			audited: false,
			billed: false,
			mondayHours: this.timesheetForm.get('monday')?.value,
			tuesdayHours: this.timesheetForm.get('tuesday')?.value,
			wednesdayHours: this.timesheetForm.get('wednesday')?.value,
			thursdayHours: this.timesheetForm.get('thursday')?.value,
			fridayHours: this.timesheetForm.get('friday')?.value,
			saturdayHours: this.timesheetForm.get('saturday')?.value,
			sundayHours: this.timesheetForm.get('sunday')?.value,
		} as ICreateTimesheetDto;
	}

	// If it is valid
	isValid() {
		if (this.isNewTimesheet) {
			return this.timesheetsForm?.valid;
		}

		return this.timesheetForm?.valid;
	}

	// Validate form
	validateForm() {
		if (this.isNewTimesheet) {
			this.timesheetsForm?.markAllAsTouched();
			return this.isValid();
		}

		this.timesheetForm?.markAllAsTouched();
		return this.isValid();
	}

	// Load timesheet
	loadTimesheet(eventData: FormGroup) {
		this.timesheetForm = eventData;
	}

	// Load timesheets
	loadTimesheets(eventData: FormGroup) {
		this.timesheetsForm = eventData;
	}

	// Close the edit view
	closeEditView() {
		this.closeEditTimesheetClicked.emit();
	}

	// After the submit button is clicked this function is executed
	submitChanges() {
		this.submitClicked.emit();
	}

	ngOnInit(): void {
		if (
			this.route.snapshot.url.length > 0 &&
			this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'new'
		) {
			this.dataLoaded = true;
			this.isNewTimesheet = true;
		}
		this.resourceService.getResourceInformation().subscribe(data => {
			this.userId = data.id;
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
