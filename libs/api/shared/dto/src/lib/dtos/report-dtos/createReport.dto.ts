import { ApiProperty } from '@nestjs/swagger';
import { ICreateReportDto } from '@tempus/shared-domain';

export class CreateReportDto implements ICreateReportDto {

	@ApiProperty()
	clientName?: string;

	@ApiProperty()
	projectName?: string;

	@ApiProperty()
	userName?: string;

	@ApiProperty()
	month?: string;

	@ApiProperty()
	hoursWorked?: number;

	@ApiProperty()
	costRate?: number;

	@ApiProperty()
	totalCost?: number;

	@ApiProperty()
	totalBilling?: number;

	@ApiProperty()
	billingRate?: number;

	constructor(
		clientName?: string,
		projectName?: string,
		userName?: string,
		month?: string,
		hoursWorked?: number,
		costRate?: number,
		totalCost?: number,
		totalBilling?: number,
		billingRate?: number,
	) {
		this.clientName = clientName;
		this.projectName = projectName;
		this.userName = userName;
		this.month = month;
		this.hoursWorked = hoursWorked;
		this.costRate = costRate;
		this.totalCost = totalCost;
		this.totalBilling = totalBilling;
		this.billingRate = billingRate;
	}
}
