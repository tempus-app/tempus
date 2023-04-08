import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientTimesheetsService,
	OnboardingClientState,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ButtonType, Column, MyTimesheetsTableData } from '@tempus/client/shared/ui-components/presentational';
import { Subject, take, takeUntil } from 'rxjs';
import {
	getAllTimesheetsBySupervisorId,
	BusinessOwnerState,
	selectSupervisorTimesheets,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { PageEvent } from '@angular/material/paginator';

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

	constructor(
		private businessownerStore: Store<BusinessOwnerState>,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
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

		this.businessownerStore.dispatch(
			getAllTimesheetsBySupervisorId({ supervisorId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		); 

		this.businessownerStore
			.select(selectSupervisorTimesheets)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.timesheetsTableData = [];
				this.totalTimesheets = data.totalTimesheets;
				console.log(data.totalTimesheets);
				data.timesheets.forEach(timesheet => {
					const startDate = new Date(timesheet.weekStartDate).toISOString().slice(0, 10);
					const endDate = new Date(timesheet.weekEndDate).toISOString().slice(0, 10);
					const status = timesheet.status.toString();
					this.timesheetsTableData.push({
						resourceName : `${timesheet.resource.firstName} ${timesheet.resource.lastName}`,
						projectName :  timesheet.project.name,
						startDate : startDate,
						endDate : endDate,
						totalTime : 30,
						status : status,
						columnsWithIcon: [],
						columnsWithUrl: [],
						columnsWithChips: ['status'],
						columnsWithButtonIcon: [],
					})
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
}
