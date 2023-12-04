export interface Report {
	reportId?: number;
	clientName?: string;
	projectName?: string;
	userName?: string;
	startDate?: Date;
	month?: number;
	year?: number;
	hoursWorked?: number;
	costRate?: number;
	totalCost?: number;
	totalBilling?: number;
	billingRate?: number;
}
