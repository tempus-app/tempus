import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { Revision } from '../..';
import { ResumeSectionType } from '../../enums';
import { UserEntity } from '../account-entities';
import { ViewEntity } from './view.entity';

@Entity()
export class RevisionEntity implements Revision {
	constructor(
		id?: number,
		createdAt?: Date,
		approvedAt?: Date,
		sectionsChanged?: ResumeSectionType[],
		approver?: UserEntity,
		approved?: boolean,
		view?: ViewEntity,
	) {
		this.id = id || 0;
		this.createdAt = createdAt || new Date();
		this.approvedAt = approvedAt || new Date();
		this.sectionsChanged = sectionsChanged || [];
		this.approver = approver || new UserEntity();
		this.approved = approved || false;
		this.view = view || new ViewEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	approvedAt: Date;

	@Column({
		type: 'enum',
		enum: ResumeSectionType,
		default: [ResumeSectionType.PERSONAL],
		array: true,
	})
	sectionsChanged: ResumeSectionType[];

	@OneToOne(() => UserEntity)
	approver: UserEntity;

	@Column()
	approved: boolean;

	@ManyToOne(() => ViewEntity, view => view.status)
	view: ViewEntity;
}
