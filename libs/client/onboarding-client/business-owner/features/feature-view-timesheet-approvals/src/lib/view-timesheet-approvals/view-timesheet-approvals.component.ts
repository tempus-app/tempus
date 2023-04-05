import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

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

	// dataSource = ELEMENT_DATA;
	dataSource = new MatTableDataSource<ApprovalData>([]);

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	displayedColumns: string[] = ['timesheetWeek', 'submittedBy', 'submissionDate', 'time', 'project'];

	comment = '';

	constructor(private translateService: TranslateService, private http: HttpClient, private dialog: MatDialog) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.http.get('http://localhost:5000/approval').subscribe(data => {
			this.dataSource.data = data as ApprovalData[];
			this.dataSource.paginator = this.paginator;
		});
	}

	openDialog(row: ApprovalData, templateRef: TemplateRef<unknown>): void {
		const dialogRef = this.dialog.open(templateRef, {
			width: '400px',
			data: row,
		});
	}
}
