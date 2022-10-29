export type TableDataModel = {
	icon?: {
		val: string;
		class: string;
		tooltip: string;
	};
	url?: string;
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
