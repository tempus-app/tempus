export interface ICreateReportDto {
	clientName?: string;
	projectName?: string;
	userName?: string;
	month?: number;
	year?: number;
	hoursWorked?: number;
	costRate?: number;
	totalCost?: number;
	totalBilling?: number;
	billingRate?: number;
}
