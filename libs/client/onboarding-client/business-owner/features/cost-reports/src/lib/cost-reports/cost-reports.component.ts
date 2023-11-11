// cost-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { Column, TableDataModel } from '@tempus/client/shared/ui-components/presentational';
import { ReportService } from './report.service';

export interface CostReport {
	clientName: string;
	projectName: string;
	userName: string;
	taskName: string;
	month: string;
	position: string;
	hoursWorked: number;
	costRate: number;
	totalCost: number;
}

// Extend TableDataModel
export interface CostReportsTableData extends TableDataModel, CostReport {
	// Add any additional fields if needed
}

@Component({
	selector: 'app-cost-reports',
	templateUrl: './cost-reports.component.html',
	styleUrls: ['./cost-reports.component.scss'],
})
export class CostReportsComponent implements OnInit {
	costReportsTableData: CostReportsTableData[] = [];
	pageNum = 1;
	totalCostReports = 1;

	// Ensure tableColumns is of type Column[]
	tableColumns: Column[] = [
		{ columnDef: 'clientName', header: 'Client Name', cell: (element: CostReportsTableData) => element.clientName },
		{
			columnDef: 'projectName',
			header: 'Project Name',
			cell: (element: CostReportsTableData) => element.projectName,
		},
		{
			columnDef: 'userName',
			header: 'User Name',
			cell: (element: CostReportsTableData) => `${element.userName}`,
		},
		{
			columnDef: 'taskName',
			header: 'Task Name',
			cell: (element: CostReportsTableData) => `${element.taskName}`,
		},
		{
			columnDef: 'month',
			header: 'Month',
			cell: (element: CostReportsTableData) => `${element.month}`,
		},
		{
			columnDef: 'position',
			header: 'Position',
			cell: (element: CostReportsTableData) => `${element.position}`,
		},
		{
			columnDef: 'hoursWorked',
			header: 'Hours Worked',
			cell: (element: CostReportsTableData) => `${element.hoursWorked}`,
		},
		{
			columnDef: 'costRate',
			header: 'Cost Rate',
			cell: (element: CostReportsTableData) => `${element.costRate}`,
		},
		{
			columnDef: 'totalCost',
			header: 'Total Cost',
			cell: (element: CostReportsTableData) => `${element.totalCost}`,
		},
	];

	constructor(private reportService: ReportService) {}
	ngOnInit(): void {
		this.loadReports();
	}

	loadReports(): void {
		this.reportService.getReports().subscribe({
			next: data => {
				this.costReportsTableData = data.map(report => ({
					...report,
					columnsWithIcon: [],
					columnsWithUrl: [],
					columnsWithChips: [],
					columnsWithButtonIcon: [],
				}));
			},
			error: err => console.error('Error fetching reports', err),
		});
	}

	tablePaginationEvent(event: any): void {
		// Implement logic for handling pagination events
		// like fetching the next set of data, etc.
	}
}
