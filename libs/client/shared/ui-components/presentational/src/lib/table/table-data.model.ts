export type TableDataModel = {
	icon?: {
		val: string;
		class: string;
		tooltip: string;
	};
	buttonIcon?: {
		icon: string;
		color: string;
	};
	url?: string;
	urlQueryParams?: { [key: string]: unknown };
	columnsWithIcon: string[];
	columnsWithUrl: string[];
	columnsWithChips: string[];
	columnsWithButtonIcon: string[];
};
export interface ProjectManagmenetTableData extends TableDataModel {
	resource: string;
	resourceId: number;
	assignment: string;
	project: string;
	client: string;
	email: string;
	allProjects: { val: string; id: number }[];
	allClients: string[];
	delete: string;
	location: string;
	active?: boolean;
}

export interface PendingApprovalsTableData extends TableDataModel {
	lastUpdated: string;
	resource: string;
	type: string;
	email: string;
}

export interface MyViewsTableData extends TableDataModel {
	type: string;
	createdBy: string;
	dateCreated: string;
	status: string;
}
export interface ViewProjects extends TableDataModel {
	name: string;
	project: string;
	start_date: string;
	status: string;
	clientReprFullName: string;
	clientReprEmail: string;
}

export interface MyTimesheetsTableData extends TableDataModel {
	timesheetWeek: string;
	dateModified: string;
	totalTime: number;
	projectName: string;
	status: string;
	timesheetId: number;
}

export interface PendingTimesheetApprovalsTableData extends TableDataModel {
	timesheetWeek: string;
	submittedBy: string;
	dateModified: string;
	totalTime: number;
	projectName: string;
	status: string;
	timesheetId: number;
}
