import { CreateLinkDto } from '@tempus/api/shared/dto';
import { Link, StatusType } from '@tempus/shared-domain';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class LinkEntity implements Link {
	constructor(
		id?: number,
		firstName?: string,
		lastName?: string,
		email?: string,
		expiry?: Date,
		token?: string,
		status?: StatusType,
		user?: UserEntity,
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.expiry = expiry;
		this.email = email;
		this.token = token;
		this.status = status;
		this.user = user;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string;

	@Column()
	expiry: Date;

	@Column({ unique: true })
	token: string;

	@Column({
		type: 'enum',
		enum: StatusType,
		default: [StatusType.ACTIVE],
	})
	status: StatusType;

	@OneToOne(() => UserEntity)
	@JoinColumn()
	user?: UserEntity;

	public static fromDto(dto: CreateLinkDto): LinkEntity {
		if (dto == null) return new LinkEntity();
		return new LinkEntity(undefined, dto.firstName, dto.lastName, dto.email, dto.expiry, undefined, undefined);
	}
}
