export interface ICreateReportDto {
	clientName?: string;
	projectName?: string;
	userName?: string;
	startDate?: string;
	month?: number;
	year?: number;
	hoursWorked?: number;
	costRate?: number;
	totalCost?: number;
	billingRate?: number;
	totalBilling?: number;

}
