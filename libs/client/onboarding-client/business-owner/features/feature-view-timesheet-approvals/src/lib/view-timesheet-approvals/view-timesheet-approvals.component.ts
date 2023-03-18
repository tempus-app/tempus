import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-view-timesheet-approvals',
	templateUrl: './view-timesheet-approvals.component.html',
	styleUrls: ['./view-timesheet-approvals.component.scss'],
})
export class ViewTimesheetApprovalsComponent implements OnInit {
	prefix = 'onboardingOwnerViewTimesheetApprovals';

	constructor(private translateService: TranslateService) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {}
}
