export interface ICreateReportDto {
	clientName?: string;
	projectName?: string;
	userName?: string;
	month?: string;
	hoursWorked?: number;
	costRate?: number;
	totalCost?: number;
	totalBilling?: number;
	billingRate?: number;
}
