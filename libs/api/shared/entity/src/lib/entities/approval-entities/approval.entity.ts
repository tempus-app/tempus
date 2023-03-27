import { CreateApprovalDto } from '@tempus/api/shared/dto';
import { Approval } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApprovalEntity implements Approval {
	constructor(
		id?: number,
		timesheetWeek?: string,
		submittedBy?: string,
		submissionDate?: string,
		time?: string,
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
	submittedBy?: string;

	@Column({ nullable: true })
	submissionDate?: string;

	@Column({ nullable: true })
	time?: string;

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
