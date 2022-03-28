import { Revision } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../account-entities';
import { ViewEntity } from './view.entity';

@Entity()
export class RevisionEntity implements Revision {
	constructor(
		id?: number,
		createdAt?: Date,
		approvedAt?: Date,
		approver?: UserEntity,
		approved?: boolean,
		view?: ViewEntity,
		newView?: ViewEntity,
	) {
		this.id = id;
		this.createdAt = createdAt;
		this.approvedAt = approvedAt;
		this.approver = approver;
		this.approved = approved;
		this.view = view;
		this.newView = newView;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ nullable: true })
	approvedAt?: Date;

	@OneToOne(() => UserEntity)
	approver: UserEntity;

	@Column({ nullable: true })
	approved?: boolean;

	@OneToOne(() => ViewEntity, view => view.revision)
	view: ViewEntity;

	@OneToOne(() => ViewEntity, view => view.revision)
	newView: ViewEntity;
}
