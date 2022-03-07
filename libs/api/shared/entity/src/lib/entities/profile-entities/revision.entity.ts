import { ResumeSectionType, Revision } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';
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
		this.id = id;
		this.createdAt = createdAt;
		this.approvedAt = approvedAt;
		this.sectionsChanged = sectionsChanged;
		this.approver = approver;
		this.approved = approved;
		this.view = view;
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
