import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface ApprovalData {
	timesheetWeek: string;
	submittedBy: string;
	submissionDate: string;
	time: string;
	project: string;
}

const ELEMENT_DATA: ApprovalData[] = [
	{
		timesheetWeek: '5 February 2023 - 11 February 2023',
		submittedBy: 'Test User',
		submissionDate: '11 February 2023',
		time: '40',
		project: 'Project 1',
	},
];
@Component({
	selector: 'tempus-view-timesheet-approvals',
	templateUrl: './view-timesheet-approvals.component.html',
	styleUrls: ['./view-timesheet-approvals.component.scss'],
})
export class ViewTimesheetApprovalsComponent implements OnInit {
	prefix = 'onboardingOwnerViewTimesheetApprovals';

	dataSource = ELEMENT_DATA;

	displayedColumns: string[] = ['timesheetWeek', 'submittedBy', 'submissionDate', 'time', 'project'];

	constructor(private translateService: TranslateService) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {

  }
}
