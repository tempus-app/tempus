import { CreateTimesheetDto } from '@tempus/api/shared/dto';
import { Timesheet, TimesheetRevisionType } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ResourceEntity, UserEntity } from '../account-entities';
import { ClientRepresentativeEntity, ProjectEntity } from '../project-entities';

@Entity()
export class TimesheetEntity implements Timesheet {
	constructor(
		id?: number,
		weekStartDate?: Date,
		weekEndDate?: Date,
		approvedBySupervisor?: boolean,
		approvedByClient?: boolean,
		resourceComment?: string,
		supervisorComment?: string,
		clientRepresentativeComment?: string,
		audited?: boolean,
		billed?: boolean,
		mondayHours?:number,
		tuesdayHours?:number,
		wednesdayHours?:number,
		thursdayHours?:number,
		fridayHours?:number,
		saturdayHours?:number,
		sundayHours?:number,
		resource?: ResourceEntity,
		project?: ProjectEntity,
		supervisor?: UserEntity,
		status?: TimesheetRevisionType,
	) {
		this.id = id;
		this.weekStartDate = weekStartDate;
		this.weekEndDate = weekEndDate;
		this.approvedBySupervisor = approvedBySupervisor;
		this.approvedByClient = approvedByClient;
		this.resourceComment = resourceComment;
		this.supervisorComment = supervisorComment;
		this.clientRepresentativeComment = clientRepresentativeComment;
		this.audited = audited;
		this.billed = billed;
		this.mondayHours = mondayHours
		this.tuesdayHours = tuesdayHours
		this.wednesdayHours = wednesdayHours
		this.thursdayHours = thursdayHours
		this.fridayHours = fridayHours
		this.saturdayHours = saturdayHours
		this.sundayHours = sundayHours
		this.resource = resource;
		this.project = project;
		this.supervisor = supervisor;
		this.status = status;
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
	resourceComment: string;

	@Column({ nullable: true })
	supervisorComment: string;

	@Column({ nullable: true })
	clientRepresentativeComment: string;

	@Column({ nullable: true })
	audited: boolean;

	@Column({ nullable: true })
	billed: boolean;

	@Column({
		type: 'enum',
		enum: TimesheetRevisionType,
		default: [TimesheetRevisionType.NEW],
	})
	status: TimesheetRevisionType;

	@Column({nullable: true})
	mondayHours: number;

	@Column({nullable: true})
	tuesdayHours:number;

	@Column({nullable: true})
	wednesdayHours:number;

	@Column({nullable: true})
	thursdayHours:number;

	@Column({nullable: true})
	fridayHours:number;

	@Column({nullable: true})
	saturdayHours:number;

	@Column({nullable: true})
	sundayHours:number;

	@ManyToOne(() => ResourceEntity, resource => resource.timesheets, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	@ManyToOne(() => ProjectEntity, project => project.timesheets)
	project: ProjectEntity;

	@ManyToOne(() => UserEntity, supervisor => supervisor.supervisedTimesheets)
	supervisor: UserEntity;

	@Column({ nullable: true })
	dateModified?: Date;

	public static fromDto(dto: CreateTimesheetDto): TimesheetEntity {
		if (dto == null) return new TimesheetEntity();
		return new TimesheetEntity(
			undefined,
			dto.weekStartDate,
			dto.weekEndDate,
			dto.approvedBySupervisor,
			dto.approvedByClient,
			dto.resourceComment,
			dto.supervisorComment,
			dto.clientRepresentativeComment,
			dto.audited,
			dto.billed,
			dto.mondayHours,
			dto.tuesdayHours,
			dto.wednesdayHours,
			dto.thursdayHours,
			dto.fridayHours,
			dto.saturdayHours,
			dto.sundayHours,
		);
	}
}
