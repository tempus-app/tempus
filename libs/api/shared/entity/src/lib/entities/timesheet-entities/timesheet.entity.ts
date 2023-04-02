import { CreateTimesheetDto } from '@tempus/api/shared/dto';
import { Timesheet } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TimesheetEntryEntity } from './timesheet-entry.entity';

@Entity()
export class TimesheetEntity implements Timesheet {
	constructor(
		id?: number,
		weekStartDate?: Date,
		weekEndDate?: Date,
		approvedBySupervisor?: boolean,
		approvedByClient?: boolean,
		supervisorComment?: string,
		clientRepresentativeComment?: string,
		audited?: boolean,
		billed?: boolean,
		timesheetEntry?: TimesheetEntryEntity[],
	) {
		this.id = id;
		this.weekStartDate = weekStartDate;
		this.weekEndDate = weekEndDate;
		this.approvedBySupervisor = approvedBySupervisor;
		this.approvedByClient = approvedByClient;
		this.supervisorComment = supervisorComment;
		this.clientRepresentativeComment = clientRepresentativeComment;
		this.audited = audited;
		this.billed = billed;
		this.timesheetEntry = timesheetEntry;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	weekStartDate: Date;

	@Column({ nullable: true })
	weekEndDate: Date;

	@Column({ nullable: true })
	approvedBySupervisor: boolean;

	@Column({ nullable: true })
	approvedByClient: boolean;

	@Column({ nullable: true })
	supervisorComment: string;

	@Column({ nullable: true })
	clientRepresentativeComment: string;

	@Column({ nullable: true })
	audited: boolean;

	@Column({ nullable: true })
	billed: boolean;

	@OneToMany(() => TimesheetEntryEntity, timesheetEntry => timesheetEntry.timesheetID)
	timesheetEntry: TimesheetEntryEntity[];

	public static fromDto(dto: CreateTimesheetDto): TimesheetEntity {
		if (dto == null) return new TimesheetEntity();
		/* const id = dto instanceof CreateTimesheetDto ? undefined : dto.id;
		 */
		return new TimesheetEntity(
			dto.id,
			dto.weekStartDate,
			dto.weekEndDate,
			dto.approvedBySupervisor,
			dto.approvedByClient,
			dto.clientRepresentativeComment,
			dto.supervisorComment,
			dto.audited,
			dto.billed,
			// dto.timesheetEntry,
		);
	}
}
