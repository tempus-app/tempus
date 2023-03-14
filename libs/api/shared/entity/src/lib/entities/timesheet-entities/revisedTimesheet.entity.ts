import { RevisedTimesheet } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RevisedTimesheetEntity implements RevisedTimesheet {
	constructor(id?: number, createdAt?: Date, approved?: boolean) {
		this.id = id;
		this.createdAt = createdAt;
		this.approved = approved;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	createdAt: Date;

	@Column({ nullable: true })
	approved: boolean;
}
