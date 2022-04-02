export type TableDataModel = {
	icon?: {
		val: string;
		class: string;
	};
	url?: string;
};
export interface ProjectManagmenetTableData extends TableDataModel {
	resource: string;
	assignment: string;
	project: string;
	client: string;
}
