import { CreateReportDto, UpdateReportDto } from '@tempus/api/shared/dto';
import { Report } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportEntity implements Report {
	constructor(
		id?: number,
		name?: string,
		title?: string,
		clientName?: string,
		workType?: string,
		hoursWorked?: number,
	) {
		this.id = id;
		this.name = name;
		this.title = title;
		this.clientName = clientName;
		this.workType = workType;
		this.hoursWorked = hoursWorked;
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

	public static fromDto(dto: CreateReportDto | UpdateReportDto): ReportEntity {
		if (dto == null) return new ReportEntity();
		const id = dto instanceof CreateReportDto ? undefined : dto.id;
		return new ReportEntity(id, dto.name, dto.title, dto.clientName, dto.workType, dto.hoursWorked);
	}
}
