import { Component, Injectable, Input, OnDestroy, OnInit, TemplateRef, VERSION, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	ButtonType,
	Column,
	MyTimesheetsTableData,
	MyViewsTableData,
} from '@tempus/client/shared/ui-components/presentational';
import {
	TempusResourceState,
	selectResourceTimesheets,
	getAllTimesheetsByResourceId,
	createTimesheet,
} from '@tempus/client/onboarding-client/resource/data-access';
import { Store } from '@ngrx/store';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	OnboardingClientTimesheetsService,
	selectLoggedInUserId,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, finalize, take, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { time } from 'console';
import { TimesheetRevisionType } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
	providers: [OnboardingClientTimesheetsService],
})
export class TimesheetComponent implements OnInit, OnDestroy {
	@Input() from!: Date;
	@Input() thru!: Date;
	prefix = 'onboardingResourceTimesheet';

	InputType = InputType;

	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 10;

	totalTimesheets = 0;

	constructor(
		private translateService: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
		private resourceStore: Store<TempusResourceState>,
		private sharedStore: Store<OnboardingClientState>,
		private fb: FormBuilder,
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
						cell: (element: Record<string, unknown>) => `${element['timesheetWeek']}`,
					},
					{
						columnDef: 'dateModified',
						header: data.dateModified,
						cell: (element: Record<string, unknown>) => `${element['dateModified']}`,
					},
					{
						columnDef: 'projectName',
						header: data.projectName,
						cell: (element: Record<string, unknown>) => `${element['projectName']}`,
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

	projectOptions: { id: number; val: string }[] = [];

	nameOfUser = '';

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(data => {
			this.projectOptions = data.projectResources.map(proj => {
				return { id: proj.project.id, val: proj.project.name };
			});
			this.nameOfUser = `${data.firstName} ${data.lastName}`;
		});

		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});

		this.resourceStore.dispatch(
			getAllTimesheetsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);

		this.resourceStore
			.select(selectResourceTimesheets)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.timesheetsTableData = [];
				this.totalTimesheets = data.totalTimesheets;

				data.timesheets?.forEach(timesheet => {
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

					const timesheetWeek = `${startDate} - ${endDate}`;

					let dateModified = '-';
					if (timesheet.dateModified) {
						dateModified = new Date(timesheet.dateModified).toLocaleString('en-US', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						});
						console.log(dateModified);
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
						timesheetWeek: timesheetWeek,
						dateModified: dateModified,
						projectName: timesheet.project.name,
						totalTime: totalTime,
						status: status,
						timesheetId: timesheet.id,
						url: `../timesheet/${timesheet.id}`,
						columnsWithIcon: [],
						columnsWithUrl: ['timesheetWeek'],
						columnsWithChips: ['status'],
						columnsWithButtonIcon: [],
					});
				});
			});
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
		this.resourceStore.dispatch(
			getAllTimesheetsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);
	}

	navigateToCreateNewTimesheet() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}
}
