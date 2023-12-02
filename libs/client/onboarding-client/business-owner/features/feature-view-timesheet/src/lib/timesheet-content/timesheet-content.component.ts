import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ICreateTimesheetDto, Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';
import { Subject, finalize, take, takeUntil } from 'rxjs';
import { ButtonType, SnackbarService } from '@tempus/client/shared/ui-components/presentational';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	OnboardingClientTimesheetsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { TempusResourceState } from '@tempus/client/onboarding-client/resource/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	getAllTimesheetsBySupervisorId,
	BusinessOwnerState,
	selectSupervisorTimesheets,
	updateTimesheetStatusAsSupervisor,
} from '@tempus/client/onboarding-client/business-owner/data-access';

@Component({
	selector: 'tempus-timesheet-content',
	templateUrl: './timesheet-content.component.html',
	styleUrls: ['./timesheet-content.component.scss'],
})
export class TimesheetContentComponent implements OnInit {
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
		private fb: FormBuilder,
		private businessownerStore: Store<BusinessOwnerState>,
	) {}

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

	timesheetPrefix = 'onboardingResourceViewTimesheet.';

	ButtonType = ButtonType;

	TimesheetRevisionType = TimesheetRevisionType;

	isRevision = false;

	viewTimesheetPrefx = 'viewTimesheet.';

	@ViewChild('approveTimesheetModal')
	approveTimesheetModal!: TemplateRef<unknown>;

	$approveTimesheetModalClosedEvent = new Subject<void>();

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

	approveTimesheetForm: FormGroup = this.fb.group({
		rejectionComments: ['', Validators.required],
	});

	$destroyed = new Subject<void>();

	@ViewChild('modalID')
	template!: TemplateRef<unknown>;

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'approveTimesheetModal') {
				this.$approveTimesheetModalClosedEvent.next();
			}
		});

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

		if (timesheet.status === TimesheetRevisionType.SUBMITTED) {
			this.isRevision = true;
		} else {
			this.isRevision = false;
		}
	}

	openRejectionDialog() {
		this.translateService
			.get(['viewTimesheet.rejectDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const rejectionDialogText = data['viewTimesheet.rejectDialog'];
				this.modalService.open(
					{
						title: rejectionDialogText.title,
						closeText: rejectionDialogText.closeText,
						confirmText: rejectionDialogText.confirmText,
						closable: true,
						template: this.template,
						id: 'reject',
					},
					CustomModalType.CONTENT,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			

			console.log(this.approveTimesheetForm.get('rejectionComments')?.value);
			const approveTimesheetDto = {
				approval: false,
				comment: this.approveTimesheetForm.get('rejectionComments')?.value,
			};

			this.businessownerStore.dispatch(
				updateTimesheetStatusAsSupervisor({
					timesheetId: parseInt(this.route.snapshot.paramMap.get('id') || '0', 10),
					approveTimesheetDto,
				}),
			);
			this.modalService.confirmEventSubject.unsubscribe();
			this.modalService.close();
			this.router.navigate(['../../timesheet-approvals'], { relativeTo: this.route }).then(() => {
				window.location.reload();
			});
		});
	}

	openConfirmationDialog() {
		this.translateService
			.get(['viewTimesheet.confirmationDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const confirmationDialogText = data['viewTimesheet.confirmationDialog'];
				this.modalService.open(
					{
						title: confirmationDialogText.title,
						confirmText: confirmationDialogText.confirmText,
						message: confirmationDialogText.message,
						modalType: ModalType.INFO,
						closable: true,
						id: 'confirm',
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			
			const approveTimesheetDto = {
				approval: true,
				comment: this.approveTimesheetForm.get('rejectionComments')?.value,
			};
			this.businessownerStore.dispatch(
				updateTimesheetStatusAsSupervisor({
					timesheetId: parseInt(this.route.snapshot.paramMap.get('id') || '0', 10),
					approveTimesheetDto,
				}),
			);
			this.modalService.confirmEventSubject.unsubscribe();
			this.modalService.close();
			this.router.navigate(['../../timesheet-approvals'], { relativeTo: this.route }).then(() => {
				window.location.reload();
			});
		});
	}

	// Reset modal data
	resetModalData() {
		this.approveTimesheetForm = this.fb.group({
			comment: [''],
		});
	}
}
