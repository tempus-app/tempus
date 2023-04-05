import { CreateTimesheetDto } from '@tempus/api/shared/dto';
import { Timesheet } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { TimesheetEntryEntity } from './timesheet-entry.entity';
import { ResourceEntity } from '../account-entities';

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
		timesheetEntries?: TimesheetEntryEntity[],
		resource? : ResourceEntity,
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
		this.timesheetEntries = timesheetEntries;
		this.resource = resource;
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

	@OneToMany(() => TimesheetEntryEntity, timesheetEntry => timesheetEntry.timesheet, {
		cascade: ['insert', 'update']
	})
	timesheetEntries: TimesheetEntryEntity[];

	@ManyToOne(() => ResourceEntity, resource => resource.timesheets, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	public static fromDto(dto: CreateTimesheetDto): TimesheetEntity {
		if (dto == null) return new TimesheetEntity();
		return new TimesheetEntity(
			undefined,
			dto.weekStartDate,
			dto.weekEndDate,
			dto.approvedBySupervisor,
			dto.approvedByClient,
			dto.clientRepresentativeComment,
			dto.supervisorComment,
			dto.audited,
			dto.billed,
			dto.timesheetEntries?.map(timesheetEntry => TimesheetEntryEntity.fromDto(timesheetEntry)),
		);
	}
}
