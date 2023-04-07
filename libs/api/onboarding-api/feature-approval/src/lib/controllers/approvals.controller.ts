import { Controller, Get } from '@nestjs/common';
import { ApprovalData } from 'libs/client/onboarding-client/business-owner/features/feature-view-timesheet-approvals/src/lib/view-timesheet-approvals/view-timesheet-approvals.component';

@Controller('approvals')
export class ApprovalsController {
	// eslint-disable-next-line class-methods-use-this
	@Get()
	findAll(): ApprovalData[] {
		return [
			{
				timesheetWeek: '5 February 2023 - 11 February 2023',
				submittedBy: 'Test User',
				submissionDate: '11 February 2023',
				time: '40',
				project: 'Project 1',
			},
			{
				timesheetWeek: '12 February 2023 - 18 February 2023',
				submittedBy: 'Test User 2',
				submissionDate: '18 February 2023',
				time: '30',
				project: 'Project 2',
			},
		];
	}
}
