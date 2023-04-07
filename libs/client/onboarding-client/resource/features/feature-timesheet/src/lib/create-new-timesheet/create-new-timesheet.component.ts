import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewTimesheetComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-timesheet/src/lib/edit-view-timesheet/edit-view-timesheet.component';
import { RevisionType, ViewType } from '@tempus/shared-domain';
import { Subject, take, takeUntil } from 'rxjs';

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
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
  ) {
    
   }

  @ViewChild(EditViewTimesheetComponent) newViewForm!: EditViewTimesheetComponent;

  ngOnInit(): void {
  }

  submitChanges() {
		
	}

  closeForm() {
		this.router.navigate(['../'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

}
