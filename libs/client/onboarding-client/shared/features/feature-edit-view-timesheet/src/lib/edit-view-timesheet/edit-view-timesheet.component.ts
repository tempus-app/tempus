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
		return {
			projectId: this.timesheetsForm.get('project')?.value,
			resourceId: this.userId,
			weekStartDate: this.timesheetsForm.get('startDate')?.value,
			weekEndDate: this.timesheetsForm.get('endDate')?.value,
			approvedBySupervisor: false,
			approvedByClient: false,
			resourceComment: this.timesheetsForm.get('comments')?.value,
			supervisorComment: '',
			clientRepresentativeComment: '',
			audited: false,
			billed: false,
			mondayHours: this.timesheetsForm.get('monday')?.value,
			tuesdayHours: this.timesheetsForm.get('tuesday')?.value,
			wednesdayHours: this.timesheetsForm.get('wednesday')?.value,
			thursdayHours: this.timesheetsForm.get('thursday')?.value,
			fridayHours: this.timesheetsForm.get('friday')?.value,
			saturdayHours: this.timesheetsForm.get('saturday')?.value,
			sundayHours: this.timesheetsForm.get('sunday')?.value,
		} as ICreateTimesheetDto;
	}

	// If it is valid
	isValid() {
		return this.timesheetsForm?.valid;
	}

	// Validate form
	validateForm() {
		this.timesheetsForm?.markAllAsTouched();
		return this.isValid();
	}

	// Load timesheet
	loadTimesheet(eventData: FormGroup) {
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
