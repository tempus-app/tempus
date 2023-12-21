/* eslint-disable prettier/prettier */
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientTimesheetsService,
	OnboardingClientState,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
	OnboardingClientResourceService,
	selectLoggedInRoles,
} from '@tempus/client/onboarding-client/shared/data-access';
import {
	ButtonType,
	Column,
	PendingTimesheetApprovalsTableData,
} from '@tempus/client/shared/ui-components/presentational';
import { Subject, take, takeUntil, finalize } from 'rxjs';
import {
	getAllTimesheetsBySupervisorId,
	BusinessOwnerState,
	selectSupervisorTimesheets,
	updateTimesheetStatusAsSupervisor,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { TimesheetRevisionType, RoleType } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-view-timesheet-approvals',
	templateUrl: './view-timesheet-approvals.component.html',
	styleUrls: ['./view-timesheet-approvals.component.scss'],
	providers: [OnboardingClientTimesheetsService],
})
export class ViewTimesheetApprovalsComponent implements OnInit, OnDestroy {
	prefix = 'onboardingSupervisorTimesheets';

	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 10;

	totalTimesheets = 0;

	InputType = InputType;

	@ViewChild('approveTimesheetModal')
	approveTimesheetModal!: TemplateRef<unknown>;

	$approveTimesheetModalClosedEvent = new Subject<void>();

	constructor(
		private store: Store<OnboardingClientState>,
		private businessownerStore: Store<BusinessOwnerState>,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private fb: FormBuilder,
		private modalService: ModalService,
		private resourceService: OnboardingClientResourceService,
	) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}.main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'timesheetWeek',
						header: data.timesheetWeek,
						cell: (element: Record<string, unknown>) => `${element.timesheetWeek}`,
					},
					{
						columnDef: 'submittedBy',
						header: data.submittedBy,
						cell: (element: Record<string, unknown>) => `${element.submittedBy}`,
					},
					{
						columnDef: 'dateModified',
						header: data.dateModified,
						cell: (element: Record<string, unknown>) => `${element.dateModified}`,
					},
					{
						columnDef: 'projectName',
						header: data.projectName,
						cell: (element: Record<string, unknown>) => `${element.projectName}`,
					},

					{
						columnDef: 'totalTime',
						header: data.totalTime,
						cell: (element: Record<string, unknown>) => `${element.totalTime}`,
					},
					{
						columnDef: 'status',
						header: data.status,
						cell: (element: Record<string, unknown>) => `${element.status}`,
					},
				];
			});
	}

	approveTimesheetForm: FormGroup = this.fb.group({
		comment: [''],
	});

	$destroyed = new Subject<void>();

	timesheetsTableData: PendingTimesheetApprovalsTableData[] = [];

	userId = 0;

	userRole = '';

	firstName = '';

	lastName = '';

	fullName = '';

	ButtonType = ButtonType;

	ngOnInit(): void {
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});
			this.store.select(selectLoggedInRoles).subscribe(roles => {
				// eslint-disable-next-line prefer-destructuring
				this.userRole = roles[0];
			});

		/* this.sharedStore
			.select(selectLoggedInRoles)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userRole = data[0];
				}
			}); */

		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'approveTimesheetModal') {
				this.$approveTimesheetModalClosedEvent.next();
			}
		});


		this.businessownerStore.dispatch(
			getAllTimesheetsBySupervisorId({
				supervisorId: this.userId,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
			}),
		);

		this.businessownerStore
			.select(selectSupervisorTimesheets)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.timesheetsTableData = [];
				this.totalTimesheets = data.totalTimesheets;

				data.timesheets.forEach(timesheet => {
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

					const fullName = `${timesheet.resource.firstName  } ${  timesheet.resource.lastName}`;
					const timesheetWeek = `${startDate} - ${endDate}`;

					let dateModified = '-';
					if (timesheet.dateModified) {
						dateModified = new Date(timesheet.dateModified).toLocaleString('en-US', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						});
					}
					const totalTime =
						timesheet.sundayHours +
						timesheet.mondayHours +
						timesheet.tuesdayHours +
						timesheet.wednesdayHours +
						timesheet.thursdayHours +
						timesheet.fridayHours +
						timesheet.saturdayHours;

					const status = timesheet.status.toString();

					this.timesheetsTableData.push({
						timesheetWeek,
						submittedBy: fullName,
						dateModified,
						projectName: timesheet.project.name,
						totalTime,
						status,
						timesheetId: timesheet.id,
						url: `../timesheet-approvals/${timesheet.id}`,
						columnsWithIcon: [],
						columnsWithUrl: ['timesheetWeek'],
						columnsWithChips: ['status'],
						columnsWithButtonIcon: [],
					});
				});
			});
	}

	approveAllPendingTimesheets() {
    if (!this.approveTimesheetForm || !this.userId) {
				this.openErrorModal('Error: Form or user information not available.');
        return;
    }


    const pendingTimesheets = this.timesheetsTableData.filter(
        (timesheet) => timesheet.status === 'SUBMITTED' || timesheet.status === 'CLIENT REVIEW'
    );


    if (pendingTimesheets.length > 0) {
        const approveTimesheetDto = {
            approval: true,
            comment: this.approveTimesheetForm.get('comment')?.value,
            approverId: this.userId,
        };

        // Approve each pending timesheet based on user role
        switch (this.userRole) {
            case RoleType.SUPERVISOR:
                if (pendingTimesheets.some((timesheet) => timesheet.status === 'SUBMITTED')) {
                    pendingTimesheets.forEach((timesheet) => {
                        this.businessownerStore.dispatch(
                            updateTimesheetStatusAsSupervisor({
                                timesheetId: timesheet.timesheetId,
                                approveTimesheetDto,
                            })
                        );
                    });
                    window.location.reload();
                } else {
                    this.openErrorModal('No pending timesheets for you to approve.');
                }
                break;

            case RoleType.CLIENT:
                if (pendingTimesheets.some((timesheet) => timesheet.status === 'CLIENT REVIEW')) {
                    pendingTimesheets.forEach((timesheet) => {
                        this.businessownerStore.dispatch(
                            updateTimesheetStatusAsSupervisor({
                                timesheetId: timesheet.timesheetId,
                                approveTimesheetDto,
                            })
                        );
                    });
                    window.location.reload();
                } else {
                    this.openErrorModal('No pending timesheets for you to approve.');
                }
                break;

								case RoleType.BUSINESS_OWNER:
									const submittedTimesheets = pendingTimesheets.filter((timesheet) => timesheet.status === 'SUBMITTED');
									if (submittedTimesheets.length > 0) {
											submittedTimesheets.forEach((timesheet) => {
													this.businessownerStore.dispatch(
															updateTimesheetStatusAsSupervisor({
																	timesheetId: timesheet.timesheetId,
																	approveTimesheetDto,
															})
													);
											});
											window.location.reload();
									} else {
											this.openErrorModal('No timesheets for you to approve.');
									}
                break;

            default:
							this.openErrorModal('Not the correct user role for this feature');
        }

    } else {
        this.openErrorModal('No pending timesheets for you to approve.');
    }
}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
	}

	tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize !== this.pageSize) {
			this.pageSize = pageEvent.pageSize;
			this.pageNum = 0;
		} else if (pageEvent.pageIndex !== this.pageNum) {
			this.pageNum = pageEvent.pageIndex;
		}
		this.businessownerStore.dispatch(
			getAllTimesheetsBySupervisorId({
				supervisorId: this.userId,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
			}),
		);
	}

	// handleRowClick(event: MouseEvent): void {
	// 	const rowElement = (event.target as HTMLElement).closest('tr');
	// 	if (rowElement) {
	// 		const rowIndex = rowElement.rowIndex - 1;
	// 		const rowData = this.timesheetsTableData[rowIndex];

	// 		this.translateService
	// 			.get(`${this.prefix}.approveTimesheetModal`)
	// 			.pipe(take(1))
	// 			.subscribe(data => {
	// 				this.modalService.open(
	// 					{
	// 						title: data.title,
	// 						id: 'approveTimesheetModal',
	// 						closable: true,
	// 						confirmText: data.confirmText,
	// 						modalType: ModalType.INFO,
	// 						// closeText: data.closeText,
	// 						template: this.approveTimesheetModal,
	// 						subtitle: data.subtitle,
	// 					},
	// 					CustomModalType.CONTENT,
	// 				);
	// 			});
	// 		this.modalService.confirmDisabled()?.next(true);
	// 		this.approveTimesheetForm?.valueChanges
	// 			.pipe(
	// 				takeUntil(this.$approveTimesheetModalClosedEvent),
	// 				finalize(() => {
	// 					const approveTimesheetDto = {
	// 						approval: true,
	// 						comment: this.approveTimesheetForm.get('comment')?.value,
	// 					};
	// 					this.businessownerStore.dispatch(
	// 						updateTimesheetStatusAsSupervisor({
	// 							timesheetId: rowData.timesheetId,
	// 							approveTimesheetDto,
	// 						}),
	// 					);
	// 					window.location.reload();
	// 				}),
	// 			)
	// 			.subscribe(() => {
	// 				if (this.approveTimesheetForm.valid) {
	// 					this.modalService.confirmDisabled()?.next(false);
	// 				} else {
	// 					this.modalService.confirmDisabled()?.next(true);
	// 				}
	// 			});

	// 		this.modalService
	// 			.closed()
	// 			.pipe(take(1))
	// 			.subscribe(() => {
	// 				this.resetModalData();
	// 			});
	// 	}
	// }

	// Reset modal data
	resetModalData() {
		this.approveTimesheetForm = this.fb.group({
			comment: [''],
		});
	}

	openErrorModal = (errorMessage: string) => {
		this.modalService.open(
			{
				title: 'Error',
				confirmText: ' ',
				closeText: 'Okay',
				message: errorMessage,
				modalType: ModalType.ERROR,
				closable: true,
				id: 'error',
			},
			CustomModalType.INFO,
		);
	};

	rejectTimesheet() {}

	approveTimesheet() {}
}
