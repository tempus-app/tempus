export interface ICreateReportDto {
	reportId?: number;
	clientName?: string;
	projectName?: string;
	userName?: string;
	taskName?: string;
	month?: string;
	position?: string;
	hoursWorked?: number;
	costRate?: number;
	totalCost?: number;
	totalBilling?: number;
	billingRate?: number;
}
