import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordReset, PasswordResetStatus } from '@tempus/shared-domain';
import { UserEntity } from './user.entity';

@Entity()
export class PasswordResetEntity implements PasswordReset {
	constructor(id: number, user: UserEntity, expiry: Date, token: string, status: PasswordResetStatus) {
		this.id = id;
		this.user = user;
		this.expiry = expiry;
		this.token = token;
		this.status = status;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, resource => resource, {
		onDelete: 'CASCADE',
	})
	user: UserEntity;

	@Column()
	token: string;

	@Column()
	expiry: Date;

	@Column({
		type: 'enum',
		enum: PasswordResetStatus,
		array: true,
	})
	status: PasswordResetStatus;
}
