import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientTimesheetsService,
	OnboardingClientState,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ButtonType, Column, MyTimesheetsTableData } from '@tempus/client/shared/ui-components/presentational';
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
import { TimesheetRevisionType } from '@tempus/shared-domain';



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
		private businessownerStore: Store<BusinessOwnerState>,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private fb: FormBuilder,
		private modalService: ModalService,
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
						columnDef: 'resourceName',
						header: data.resourceName,
						cell: (element: Record<string, unknown>) => `${element['resourceName']}`,
					},
					{
						columnDef: 'projectName',
						header: data.projectName,
						cell: (element: Record<string, unknown>) => `${element['projectName']}`,
					},
					{
						columnDef: 'startDate',
						header: data.startDate,
						cell: (element: Record<string, unknown>) => `${element['startDate']}`,
					},
					{
						columnDef: 'endDate',
						header: data.endDate,
						cell: (element: Record<string, unknown>) => `${element['endDate']}`,
					},
					{
						columnDef: 'totalTime',
						header: data.totalTime,
						cell: (element: Record<string, unknown>) => `${element['totalTime']}`,
					},
					{
						columnDef: 'status',
						header: data.status,
						cell: (element: Record<string, unknown>) => `${element['status']}`,
					},
				];
			});
	}

	approveTimesheetForm: FormGroup = this.fb.group({
		comment: [''],
	});

	$destroyed = new Subject<void>();

	timesheetsTableData: MyTimesheetsTableData[] = [];

	userId = 0;

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

			this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
				this.modalService.close();
				if (modalId === 'approveTimesheetModal') {
					this.$approveTimesheetModalClosedEvent.next();
				}
			});

		this.businessownerStore.dispatch(
			getAllTimesheetsBySupervisorId({ supervisorId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		); 

		this.businessownerStore
			.select(selectSupervisorTimesheets)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.timesheetsTableData = [];
				this.totalTimesheets = data.totalTimesheets;
				data.timesheets.forEach(timesheet => {
					const startDate = new Date(timesheet.weekStartDate).toISOString().slice(0, 10);
					const endDate = new Date(timesheet.weekEndDate).toISOString().slice(0, 10);
					const status = timesheet.status.toString();

					if(status != "NEW"){
						this.timesheetsTableData.push({
							resourceName : `${timesheet.resource.firstName} ${timesheet.resource.lastName}`,
							projectName :  timesheet.project.name,
							startDate : startDate,
							endDate : endDate,
							totalTime : 30,
							status : status,
							timesheetId : timesheet.id,
							columnsWithIcon: [],
							columnsWithUrl: [],
							columnsWithChips: ['status'],
							columnsWithButtonIcon: [],
						})
					}
				})
				console.log(this.timesheetsTableData); 
			})
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
			getAllTimesheetsBySupervisorId({ supervisorId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);
	}

	handleRowClick(event: MouseEvent): void {
		const rowElement = (event.target as HTMLElement).closest('tr');
		if (rowElement) {
		  const rowIndex = rowElement.rowIndex - 1;
		  const rowData = this.timesheetsTableData[rowIndex];


		  this.translateService
			.get(`${this.prefix}.approveTimesheetModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data.title,
						id: 'approveTimesheetModal',
						closable: true,
						confirmText: data.confirmText,
						modalType: ModalType.INFO,
						//closeText: data.closeText,
						template: this.approveTimesheetModal,
						subtitle: data.subtitle,
					},
					CustomModalType.CONTENT,
				);
			});
		this.modalService.confirmDisabled()?.next(true);
		this.approveTimesheetForm?.valueChanges
			.pipe(
				takeUntil(this.$approveTimesheetModalClosedEvent),
				finalize(() => {
					const approveTimesheetDto = {
					approval: true,
					comment: this.approveTimesheetForm.get('comment')?.value,
					}
					this.businessownerStore.dispatch(updateTimesheetStatusAsSupervisor({timesheetId: rowData.timesheetId ,approveTimesheetDto: approveTimesheetDto}));
					window.location.reload();
				}),
			)
			.subscribe(() => {
				if (this.approveTimesheetForm.valid) {
					this.modalService.confirmDisabled()?.next(false);
				} else {
					this.modalService.confirmDisabled()?.next(true);
				}
			});

		this.modalService
			.closed()
			.pipe(take(1))
			.subscribe(() => {
				this.resetModalData();
			});
		}
	  }

	  // Reset modal data
	resetModalData() {
		this.approveTimesheetForm = this.fb.group({
			comment: ['']
		});

	}

	rejectTimesheet(){}

	approveTimesheet(){}

}
