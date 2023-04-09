import { Component, Injectable, Input, OnDestroy, OnInit, VERSION } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangePicker, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType, Column, MyTimesheetsTableData, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';
import { TempusResourceState, selectResourceTimesheets, getAllTimesheetsByResourceId } from '@tempus/client/onboarding-client/resource/data-access';
import { Store } from '@ngrx/store';
import { OnboardingClientState, OnboardingClientTimesheetsService, selectLoggedInUserId } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'tempus-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  providers: [
    OnboardingClientTimesheetsService
  ],
})
export class TimesheetComponent implements OnInit, OnDestroy {
  @Input() from !: Date;
  @Input() thru !: Date;
  prefix = 'onboardingResourceTimesheet';

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

		this.resourceStore.dispatch(
			getAllTimesheetsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		); 

		this.resourceStore
			.select(selectResourceTimesheets)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.timesheetsTableData = [];
				this.totalTimesheets = data.totalTimesheets;

				console.log(this.totalTimesheets);
				console.log(data.timesheets);
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
		this.resourceStore.dispatch(
			getAllTimesheetsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);
	}

  navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}

}
