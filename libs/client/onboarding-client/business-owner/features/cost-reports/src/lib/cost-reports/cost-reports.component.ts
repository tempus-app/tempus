// cost-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { Column, TableDataModel } from '@tempus/client/shared/ui-components/presentational';

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
	pageNum = 1;
	totalCostReports = 1;

	// Using the extended interface
	costReportsTableData: CostReportsTableData[] = [
		{
			clientName: 'Client A',
			projectName: 'Project X',
			userName: 'User 1',
			taskName: 'Task Alpha',
			month: 'January',
			position: 'Developer',
			hoursWorked: 160,
			costRate: 30,
			totalCost: 4800,
			columnsWithIcon: [],
			columnsWithUrl: [],
			columnsWithChips: [],
			columnsWithButtonIcon: [],
		},
		// ... Add more sample data as needed ...
	];

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

	constructor() {}

	ngOnInit(): void {
		// Implement additional logic as required
	}

	tablePaginationEvent(event: any): void {
		// Implement logic for handling pagination events
		// like fetching the next set of data, etc.
	}
}
