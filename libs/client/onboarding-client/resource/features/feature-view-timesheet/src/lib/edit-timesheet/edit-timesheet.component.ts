import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
	OnboardingClientResourceService,
	OnboardingClientTimesheetsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewTimesheetComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-timesheet/src/lib/edit-view-timesheet/edit-view-timesheet.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetRevisionType } from '@tempus/shared-domain';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-edit-timesheet',
	templateUrl: './edit-timesheet.component.html',
	styleUrls: ['./edit-timesheet.component.scss'],
})
export class EditTimesheetComponent implements OnInit {
	constructor(
		public modalService: ModalService,
		private router: Router,
		private route: ActivatedRoute,
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private timesheetService: OnboardingClientTimesheetsService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@ViewChild(EditViewTimesheetComponent) newTimesheetForm!: EditViewTimesheetComponent;

	@Output()
	closeEditViewClicked = new EventEmitter();

	destroyed$ = new Subject<void>();

	ngOnInit(): void {
		const timesheetId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		if (timesheetId) {
			this.timesheetService
				.getTimesheetById(timesheetId)
				.pipe(take(1))
				.subscribe(timesheet => {
					this.newTimesheetForm.setFormDataFromTimesheet(timesheet);
				});
		}
	}

	submitChanges() {
		if (this.newTimesheetForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	updateTimesheet() {
		const newGeneratedTimesheet = this.newTimesheetForm.generateNewTimesheet();
		const newTimesheet = { ...newGeneratedTimesheet, id: this.newTimesheetForm.currentTimesheetId };
		this.timesheetService
			.editTimesheet(newTimesheet)
			.pipe(take(1))
			.subscribe(revision => {
				this.router
					.navigate(['../', revision.id], {
						relativeTo: this.route,
					})
					.then(() => {
						window.location.reload();
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
			this.updateTimesheet();
			this.modalService.close();
			this.closeEditTimesheet();
		});
	}

	closeEditTimesheet() {
		this.closeEditViewClicked.emit();
	}
}
