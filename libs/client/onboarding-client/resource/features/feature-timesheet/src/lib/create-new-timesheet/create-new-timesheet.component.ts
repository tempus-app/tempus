import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	OnboardingClientTimesheetsService,
	selectLoggedInUserId,
} from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewTimesheetComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-timesheet/src/lib/edit-view-timesheet/edit-view-timesheet.component';
import {
	ICreateProjectDto,
	ICreateTimesheetEntryDto,
	ICreateUserDto,
	Project,
	RevisionType,
	Timesheet,
	TimesheetRevisionType,
	User,
	ViewType,
} from '@tempus/shared-domain';
import { Subject, pipe, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
	selector: 'tempus-create-new-timesheet',
	templateUrl: './create-new-timesheet.component.html',
	styleUrls: ['./create-new-timesheet.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class CreateNewTimesheetComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public modalService: ModalService,
		private sharedStore: Store<OnboardingClientState>,
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private timesheetService: OnboardingClientTimesheetsService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	dataLoaded = false;

	userId = 0;

	@ViewChild(EditViewTimesheetComponent) newTimesheetForm!: EditViewTimesheetComponent;

	destroyed$ = new Subject<void>();

	ngOnInit(): void {
		this.userId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});
	}

	// loadTimesheet(timesheet: Timesheet) {
	// 	this.timesheetId = timesheet.id;
	// 	this.userId = timesheet.resource.id;
	// 	//this.timesheetEntries = timesheet.timesheetEntries;
	// 	this.projectId = timesheet.project.id;
	// 	this.supervisor = timesheet.supervisor;
	// 	this.startDate = timesheet.weekStartDate;
	// 	this.endDate = timesheet.weekEndDate;
	// 	this.supervisorApproval = timesheet.approvedBySupervisor;
	// 	this.clientApproval = timesheet.approvedByClient;
	// 	this.supervisorComment = timesheet.supervisorComment;
	// 	this.clientComment = timesheet.clientRepresentativeComment;
	// 	this.audited = timesheet.audited;
	// 	this.billed = timesheet.billed;
	// 	this.status = timesheet.status;
	// 	this.dateModified = timesheet.dateModified;
	// }

	submitChanges() {
		if (this.newTimesheetForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	createNewTimesheet() {
		const newTimesheet = this.newTimesheetForm.generateNewTimesheet();
		this.timesheetService
			.createTimesheet(newTimesheet)
			.pipe(take(1))
			.subscribe(timesheet => {
				this.router.navigate(['../'], {
					queryParams: { timesheetId: timesheet.id },
					relativeTo: this.route,
				});
			});
	}

	openSubmitConfirmation() {
		this.translateService
			.get([`onboardingResourceCreateNewTimesheet.submitModal`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingResourceCreateNewTimesheet.submitModal`];
				this.modalService.open(
					{
						title: dialogText.title,
						closeText: dialogText.closeText,
						confirmText: dialogText.confirmText,
						message: dialogText.message,
						closable: true,
						id: 'submit',
						modalType: ModalType.WARNING,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
			this.createNewTimesheet();
			this.modalService.close();
		});
	}

	closeForm() {
		this.router.navigate(['../'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
