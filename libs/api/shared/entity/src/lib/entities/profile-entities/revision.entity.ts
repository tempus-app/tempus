import { Revision } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ViewEntity } from './view.entity';

@Entity()
export class RevisionEntity implements Revision {
	constructor(id?: number, createdAt?: Date, approved?: boolean, views?: ViewEntity[]) {
		this.id = id;
		this.createdAt = createdAt;
		this.approved = approved;
		this.views = views;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ nullable: true })
	comment: string;

	@Column({ nullable: true })
	approved?: boolean;

	@OneToMany(() => ViewEntity, views => views.revision)
	views: ViewEntity[];
}
