import { CreateTimesheetDto } from '@tempus/api/shared/dto';
import { Timesheet } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ResourceEntity } from '../account-entities';

@Entity()
export class TimesheetEntity implements Timesheet {
	constructor(
		id?: number,
		daysWorked?: string,
		totalHoursWorked?: number,
		comments?: string,
		projects?: string,
		audited?: boolean,
		billed?: boolean,
		resource?: ResourceEntity,
	) {
		this.id = id ?? 0;
		this.daysWorked = daysWorked ?? '';
		this.totalHoursWorked = totalHoursWorked ?? 0;
		this.comments = comments ?? '';
		this.projects = projects ?? '';
		this.audited = audited ?? false;
		this.billed = billed ?? false;
		this.resource = resource ?? new ResourceEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	daysWorked: string;

	@Column({ nullable: true })
	totalHoursWorked: number;

	@Column({ nullable: true })
	comments: string;

	@Column({ nullable: true })
	projects: string;

	@Column({ nullable: true })
	audited: boolean;

	@Column({ nullable: true })
	billed: boolean;

	@ManyToOne(() => ResourceEntity, resource => resource.timesheets, { cascade: ['insert', 'update'] })
	resource: ResourceEntity;

	public static fromDto(dto: CreateTimesheetDto): TimesheetEntity {
		if (dto == null) return new TimesheetEntity();
		/* const id = dto instanceof CreateTimesheetDto ? undefined : dto.id;
		 */
		return new TimesheetEntity(
			dto.id,
			dto.daysWorked,
			dto.totalHoursWorked,
			dto.comments,
			dto.projects,
			dto.audited,
			dto.billed,
		);
	}
}
