export type TableDataModel = {
	icon?: {
		val: string;
		class: string;
		tooltip: string;
	};
	url?: string;
	urlQueryParams?: { [key: string]: unknown };
	columnsWithIcon: string[];
	columnsWithUrl: string[];
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
}

export interface PendingApprovalsTableData extends TableDataModel {
	lastUpdated: string;
	resource: string;
	type: string;
	email: string;
}

export interface ViewProjects extends TableDataModel {
	name: string;
	project: string;
	start_date: string;
	status: string;
}
