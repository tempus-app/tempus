import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService, OnboardingClientState, OnboardingClientTimesheetsService, selectLoggedInUserId } from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewTimesheetComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-timesheet/src/lib/edit-view-timesheet/edit-view-timesheet.component';
import { ICreateProjectDto, ICreateTimesheetEntryDto, ICreateUserDto, Project, RevisionType, Timesheet, TimesheetRevisionType, User, ViewType } from '@tempus/shared-domain';
import { Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tempus-create-new-timesheet',
  templateUrl: './create-new-timesheet.component.html',
  styleUrls: ['./create-new-timesheet.component.scss']
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

   timesheetId = 0;
   userId = 0;
   timesheetEntries: Array<ICreateTimesheetEntryDto> = [];
   projectId: number = 0;
   supervisor: ICreateUserDto | null = null
   startDate: Date = new Date();
   endDate: Date = new Date();
   supervisorApproval : boolean = false;
   clientApproval : boolean = false;
   supervisorComment : string = "";
   clientComment : string = "";
   audited: boolean = false;
   billed: boolean = false;
   status: TimesheetRevisionType = TimesheetRevisionType.NEW;
   dateModified?: Date = new Date();

  @ViewChild(EditViewTimesheetComponent) newViewForm!: EditViewTimesheetComponent;

  ngOnInit(): void {

    this.sharedStore
    .select(selectLoggedInUserId)
    .pipe(take(1))
    .subscribe(data => {
      if (data) {
        this.userId = data;
      }
    });

    const timesheetId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
			if (timesheetId) {
				this.timesheetService.getTimesheetById(timesheetId).subscribe(timesheet => {
					this.loadTimesheet(timesheet);
					this.dataLoaded = true;
				});
      }
  }

  loadTimesheet(timesheet:Timesheet){

      this.timesheetId = timesheet.id;
      this.userId = timesheet.resource.id;
      this.timesheetEntries = timesheet.timesheetEntries;
      this.projectId = timesheet.project.id;
      this.supervisor = timesheet.supervisor;
      this.startDate = timesheet.weekStartDate;
      this.endDate = timesheet.weekEndDate;
      this.supervisorApproval = timesheet.approvedBySupervisor;
      this.clientApproval = timesheet.approvedByClient;
      this.supervisorComment = timesheet.supervisorComment;
      this.clientComment = timesheet.clientRepresentativeComment;
      this.audited = timesheet.audited;
      this.billed = timesheet.billed;
      this.status = timesheet.status;
      this.dateModified = timesheet.dateModified;

  }

  submitChanges() {
		
	}

  closeForm() {
		this.router.navigate(['../../'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

}
