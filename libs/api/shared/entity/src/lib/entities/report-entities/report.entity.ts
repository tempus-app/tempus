import { Report } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateReportDto } from '@tempus/api/shared/dto';

@Entity()
export class ReportEntity implements Report {
	constructor(
		id: number,
		name: string,
		title: string,
		clientName: string,
		workType: string,
		hoursWorked: number,
		costRate: number,
		billingRate: number,
	) {
		this.id = id;
		this.name = name;
		this.title = title;
		this.clientName = clientName;
		this.workType = workType;
		this.hoursWorked = hoursWorked;
		this.costRate = costRate;
		this.billingRate = billingRate;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	title: string;

	@Column({ nullable: true })
	clientName: string;

	@Column({ nullable: true })
	workType: string;

	@Column({ nullable: true })
	hoursWorked: number;

	@Column({ nullable: true })
	costRate: number;

	@Column({ nullable: true })
	billingRate: number;

	public static fromDto(dto: CreateReportDto): ReportEntity {
		if (dto == null) return new ReportEntity();
		return new ReportEntity(
			dto.id,
			dto.name,
			dto.title,
			dto.clientName,
			dto.workType,
			dto.hoursWorked,
			dto.costRate,
			dto.billingRate,
		);
	}
}
