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
	ICreateUserDto,
	Project,
	RevisionType,
	Timesheet,
	TimesheetRevisionType,
	User,
	ViewType,
} from '@tempus/shared-domain';
import { Subject, forkJoin, pipe, take, takeUntil } from 'rxjs';
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

	submitChanges() {
		if (this.newTimesheetForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	createNewTimesheet() {
		const newTimesheets = this.newTimesheetForm.generateNewTimesheet();

		const timesheets = newTimesheets.map(item => this.timesheetService.createTimesheet(item));

		const error = this.newTimesheetForm.timesheetError;

		// If there is no multiple timesheet with same project error, submit timesheet
		if (!error) {
			forkJoin(timesheets).subscribe(
				timesheet => {
					this.router.navigate(['../'], {
						relativeTo: this.route,
					});
				},
				error => {
					if (error) {
						this.openTimesheetErrorModal(error.message);
					}
				},
			);
		}

		return error;
	}

	// Submission confirmation
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

		this.modalService.confirmEventSubject.pipe(take(1)).subscribe(() => {
			this.modalService.close();
			const result = this.createNewTimesheet();

			if (result) {
				this.translateService
					.get(`onboardingResourceErrorTimesheet.errorModal`)
					.pipe(take(1))
					.subscribe(data => {
						this.openTimesheetErrorModal(data.message);
					});
			}
		});
	}

	// Timesheet Error Modal
	openTimesheetErrorModal(error: string) {
		this.translateService
			.get(`onboardingResourceErrorTimesheet.errorModal`)
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data;
				this.modalService.open(
					{
						title: dialogText.title,
						confirmText: dialogText.confirmText,
						message: error,
						closable: true,
						id: 'error',
						modalType: ModalType.ERROR,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
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
