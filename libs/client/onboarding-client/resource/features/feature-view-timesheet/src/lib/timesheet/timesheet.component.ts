/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	OnboardingClientTimesheetsService,
	OnboardingClientViewsService,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { catchError, of, Subject, take, takeUntil } from 'rxjs';
import { ButtonType, SnackbarService } from '@tempus/client/shared/ui-components/presentational';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import {
	TempusResourceState,
	getAllTimesheetsByResourceId,
} from '@tempus/client/onboarding-client/resource/data-access';
import { ICreateTimesheetDto, Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit {
	pageSize = 1000;

	pageNum = 0;

	constructor(
		private resourceService: OnboardingClientResourceService,
		private timesheetService: OnboardingClientTimesheetsService,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private resourceStore: Store<TempusResourceState>,
		private modalService: ModalService,
		private snackbar: SnackbarService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	dataLoaded = false;

	userId = 0;

	currentTimesheetId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	timesheetWeek = '';

	startDate: Date = new Date();

	endDate: Date = new Date();

	projectId = 0;

	projectName = '';

	approvedBySupervisor = false;

	approvedByClient = false;

	supervisorComment = '';

	clientRepresentativeComment = '';

	mondayHours = '';

	tuesdayHours = '';

	wednesdayHours = '';

	thursdayHours = '';

	fridayHours = '';

	saturdayHours = '';

	sundayHours = '';

	audited = false;

	billed = false;

	status: TimesheetRevisionType = TimesheetRevisionType.SUBMITTED;

	dateModified?: Date = new Date();

	editTimesheetEnabled = false;

	destroyed$ = new Subject<void>();

	profilePrefix = 'onboardingResourceProfile.';

	ButtonType = ButtonType;

	TimesheetRevisionType = TimesheetRevisionType;

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

	ngOnInit(): void {
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});

		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
			});

		this.resourceStore.dispatch(
			getAllTimesheetsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);

		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.fullName = `${resData.firstName} ${resData.lastName}`;

			const timesheetId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

			this.timesheetService.getTimesheetById(timesheetId).subscribe(timesheet => {
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

				this.projectName = timesheet.project.name;

				this.timesheetWeek = `${startDate} - ${endDate}`;
				this.loadTimesheet(timesheet);
				this.dataLoaded = true;
			});
		});
	}

	loadTimesheet(timesheet: Timesheet) {
		this.timesheet.projectId = timesheet.project.id;
		this.timesheet.resourceId = timesheet.resource.id;
		this.timesheet.weekStartDate = timesheet.weekStartDate;
		this.timesheet.weekEndDate = timesheet.weekEndDate;
		this.timesheet.approvedBySupervisor = timesheet.approvedBySupervisor;
		this.timesheet.approvedByClient = timesheet.approvedByClient;
		this.timesheet.resourceComment = timesheet.resourceComment;
		this.timesheet.supervisorComment = timesheet.supervisorComment;
		this.timesheet.clientRepresentativeComment = timesheet.clientRepresentativeComment;
		this.timesheet.audited = timesheet.audited;
		this.timesheet.billed = timesheet.billed;
		this.timesheet.mondayHours = timesheet.mondayHours;
		this.timesheet.tuesdayHours = timesheet.tuesdayHours;
		this.timesheet.wednesdayHours = timesheet.wednesdayHours;
		this.timesheet.thursdayHours = timesheet.thursdayHours;
		this.timesheet.fridayHours = timesheet.fridayHours;
		this.timesheet.saturdayHours = timesheet.saturdayHours;
		this.timesheet.sundayHours = timesheet.sundayHours;
	}

	openEditTimesheet() {
		this.editTimesheetEnabled = true;
	}

	closeEditView() {
		this.editTimesheetEnabled = false;
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
