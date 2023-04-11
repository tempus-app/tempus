import { Component, Injectable, Input, OnDestroy, OnInit, TemplateRef, VERSION, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangePicker, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType, Column, MyTimesheetsTableData, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';
import { TempusResourceState, selectResourceTimesheets, getAllTimesheetsByResourceId, createTimesheet } from '@tempus/client/onboarding-client/resource/data-access';
import { Store } from '@ngrx/store';
import { OnboardingClientResourceService, OnboardingClientState, OnboardingClientTimesheetsService, selectLoggedInUserId } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, finalize, take, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { InputType } from '@tempus/client/shared/ui-components/input';


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

  	InputType = InputType;

  	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 10;

	totalTimesheets = 0;

	@ViewChild('createTimesheetModal')
	createTimesheetModal!: TemplateRef<unknown>;

	$createTimesheetModalClosedEvent = new Subject<void>();

	constructor(
		private translateService: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
		private resourceStore: Store<TempusResourceState>,
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

   // Create timesheet form builder group
   createTimesheetForm: FormGroup = this.fb.group({
	startDate: ['', Validators.required],
	endDate: ['', Validators.required],
	project: ['', Validators.required],
} ,{ validator: validateEndDateAfterStartDate });
   

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

		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'createTimesheetModal') {
				this.$createTimesheetModalClosedEvent.next();
			}
		});

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
						totalTime : 0,
						status : status,
            timesheetId: timesheet.id,
						url: `../timesheet/new`,
						columnsWithIcon: [],
						columnsWithUrl: ['resourceName'],
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

	// After clicking the create timesheet button the create timesheet modal is opened
	createTimesheet = () => {
		this.translateService
			.get(`${this.prefix}.createTimesheetModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data.title,
						id: 'createTimesheetModal',
						closable: true,
						confirmText: data.confirmText,
						modalType: ModalType.INFO,
						closeText: data.closeText,
						template: this.createTimesheetModal,
						subtitle: data.subtitle,
					},
					CustomModalType.CONTENT,
				);
			});
		this.modalService.confirmDisabled()?.next(true);
		this.createTimesheetForm?.valueChanges
			.pipe(
				takeUntil(this.$createTimesheetModalClosedEvent),
				finalize(() => {
					const createTimesheetDto = {
					supervisorId: undefined,
					projectId: this.createTimesheetForm.get('project')?.value,
					resourceId : this.userId,
					weekStartDate: this.createTimesheetForm.get('startDate')?.value,
					weekEndDate: this.createTimesheetForm.get('endDate')?.value,
					approvedBySupervisor: false,
					approvedByClient: false,
					supervisorComment: "",
					clientRepresentativeComment: "",
					audited: false,
					billed: false,
					}
					this.resourceStore.dispatch(createTimesheet({ createTimesheetDto }));

					this.createTimesheetForm.reset();
					window.location.reload();
				}),
			)
			.subscribe(() => {
				if (this.createTimesheetForm.valid) {
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
	};

	// Reset modal data
	resetModalData() {
		this.createTimesheetForm = this.fb.group({
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			project: ['', Validators.required],
		});
	}

  navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}


}


function validateEndDateAfterStartDate(control: FormGroup) {
	const startDate = control.get('startDate')?.value;
	const endDate = control.get('endDate')?.value;
  
	if (endDate && startDate && endDate < startDate) {
	  control.get('endDate')?.setErrors({ dateMismatch: true });
	} else {
	  control.get('endDate')?.setErrors(null);
	}
}
