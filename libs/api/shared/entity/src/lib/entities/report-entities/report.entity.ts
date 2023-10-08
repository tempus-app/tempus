/* eslint-disable @typescript-eslint/no-dupe-class-members */
import { Report } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';

@Entity()
export class ReportEntity implements Report {
	constructor(
		reportId: number,
		clientName: string,
		projectName: string,
		userName: string,
		taskName: string,
		month: string,
		position: string,
		hoursWorked: number,
		costRate: number,
		totalCost: number,
		totalBilling: number,
		billingRate: number,
	) {
		this.reportId = reportId;
		this.clientName = clientName;
		this.projectName = projectName;
		this.userName = userName;
		this.taskName = taskName;
		this.month = month;
		this.position = position;
		this.hoursWorked = hoursWorked;
		this.costRate = costRate;
		this.totalCost = totalCost;
		this.totalBilling = totalBilling;
		this.billingRate = billingRate;
	}

	// eslint-disable-next-line @typescript-eslint/no-dupe-class-members
	@PrimaryGeneratedColumn()
	reportId?: number;

	@Column()
	clientName?: string;

	@Column()
	projectName?: string;

	@Column()
	userName?: string;

	@Column()
	taskName?: string;

	@Column()
	month?: string;

	@Column()
	position?: string;

	@Column()
	hoursWorked?: number;

	@Column()
	costRate?: number;

	@Column()
	totalCost?: number;

	@Column()
	totalBilling?: number;

	@Column()
	billingRate?: number;

	public static fromDto(dto: CreateReportDto): ReportEntity {
		if (dto == null)
			return new ReportEntity(null, null, null, null, null, null, null, null, null, null, null, null);
		return new ReportEntity(null, null, null, null, null, null, null, null, null, null, null, null);
	}
}
