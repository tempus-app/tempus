/* eslint-disable prettier/prettier */
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
	startDate?: string;

	@ApiProperty()
	month?: number;

	@ApiProperty()
	year?: number;

	@ApiProperty()
	hoursWorked?: number;

	@ApiProperty()
	costRate?: number;

	@ApiProperty()
	totalCost?: number;

	@ApiProperty()
	billingRate?: number;

	@ApiProperty()
	totalBilling?: number;


	constructor(
		clientName?: string,
		projectName?: string,
		userName?: string,
		startDate?: string,
		month?: number,
		year?: number,
		hoursWorked?: number,
		costRate?: number,
		totalCost?: number,
		billingRate?: number,
		totalBilling?: number,

	) {
		this.clientName = clientName;
		this.projectName = projectName;
		this.userName = userName;
		this.startDate = startDate;
		this.month = month;
		this.year = year;
		this.hoursWorked = hoursWorked;
		this.costRate = costRate;
		this.totalCost = totalCost;
		this.billingRate = billingRate;
		this.totalBilling = totalBilling;
	}
}
