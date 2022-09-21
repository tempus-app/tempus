import { Revision } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ViewEntity } from './view.entity';

@Entity()
export class RevisionEntity implements Revision {
	constructor(id?: number, createdAt?: Date, approved?: boolean, view?: ViewEntity, newView?: ViewEntity) {
		this.id = id;
		this.createdAt = createdAt;
		this.approved = approved;
		this.view = view;
		this.newView = newView;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ nullable: true })
	comment: string;

	@Column({ nullable: true })
	approved?: boolean;

	@OneToOne(() => ViewEntity, view => view.revision)
	@JoinColumn()
	view: ViewEntity;

	@OneToOne(() => ViewEntity, view => view.revision)
	@JoinColumn()
	newView: ViewEntity;
}
