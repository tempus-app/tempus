/* eslint-disable @typescript-eslint/no-dupe-class-members */
import { Report } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';

@Entity()
export class ReportEntity implements Report {
	constructor(
		reportId?: number,
		clientName?: string,
		projectName?: string,
		userName?: string,
		startDate?: Date,
		month?: number,
		year?: number,
		hoursWorked?: number,
		costRate?: number,
		totalCost?: number,
		totalBilling?: number,
		billingRate?: number,
	) {
		this.reportId = reportId;
		this.clientName = clientName;
		this.projectName = projectName;
		this.userName = userName;
		this.startDate = startDate;
		this.month = month;
		this.year = year;
		this.hoursWorked = hoursWorked;
		this.costRate = costRate;
		this.totalCost = totalCost;
		this.totalBilling = totalBilling;
		this.billingRate = billingRate;
	}

	// eslint-disable-next-line @typescript-eslint/no-dupe-class-members
	@PrimaryGeneratedColumn()
	reportId?: number;

	@Column({ nullable: true })
	clientName?: string;

	@Column({ nullable: true })
	projectName?: string;

	@Column({ nullable: true })
	userName?: string;

	@Column({ nullable: true })
	startDate?: Date;

	@Column({ nullable: true })
	month?: number;

	@Column({ nullable: true })
	year?: number;

	@Column({ nullable: true })
	hoursWorked?: number;

	@Column({ nullable: true })
	costRate?: number;

	@Column({ nullable: true })
	totalCost?: number;

	@Column({ nullable: true })
	totalBilling?: number;

	@Column()
	billingRate?: number;

	public static fromDto(dto: CreateReportDto): ReportEntity {
		if (dto == null) return new ReportEntity();
		return new ReportEntity(
			undefined,
			dto.clientName,
			dto.projectName,
			dto.userName,
			dto.startDate,
			dto.month,
			dto.year,
			dto.hoursWorked,
			dto.costRate,
			dto.totalCost,
			dto.billingRate,
			dto.totalBilling,
		);
	}
}
