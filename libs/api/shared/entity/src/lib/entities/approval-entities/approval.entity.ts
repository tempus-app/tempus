import { CreateApprovalDto } from '@tempus/api/shared/dto';
import { Approval } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApprovalEntity implements Approval {
	constructor(
		id?: number,
		timesheetWeek?: string,
		submittedBy?: number,
		submissionDate?: string,
		time?: number,
		project?: string,
	) {
		this.id = id;
		this.timesheetWeek = timesheetWeek;
		this.submittedBy = submittedBy;
		this.submissionDate = submissionDate;
		this.time = time;
		this.project = project;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	timesheetWeek?: string;

	@Column({ nullable: true })
	submittedBy?: number;

	@Column({ nullable: true })
	submissionDate?: string;

	@Column({ nullable: true })
	time?: number;

	@Column({ nullable: true })
	project?: string;

	public static fromDto(dto: CreateApprovalDto): ApprovalEntity {
		if (dto == null) return new ApprovalEntity();
		/* const id = dto instanceof CreateTimesheetDto ? undefined : dto.id;
		 */
		return new ApprovalEntity(
			dto.id,
			dto.timesheetWeek,
			dto.submittedBy,
			dto.submissionDate,
			dto.time,
			dto.project,
		);
	}
}
