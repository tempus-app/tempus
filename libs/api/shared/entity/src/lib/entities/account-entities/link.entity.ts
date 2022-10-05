import { CreateLinkDto } from '@tempus/api/shared/dto';
import { Link, RoleType, StatusType } from '@tempus/shared-domain';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../project-entities';
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
		userType?: RoleType,
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.expiry = expiry;
		this.email = email;
		this.token = token;
		this.status = status;
		this.user = user;
		this.userType = userType;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
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

	@Column({
		type: 'enum',
		enum: RoleType,
		default: [RoleType.AVAILABLE_RESOURCE],
	})
	userType: RoleType;

	@OneToOne(() => UserEntity)
	@JoinColumn()
	user?: UserEntity;

	@ManyToOne(() => ProjectEntity)
	@JoinColumn()
	project: ProjectEntity;

	public static fromDto(dto: CreateLinkDto): LinkEntity {
		if (dto == null) return new LinkEntity();
		return new LinkEntity(
			undefined,
			dto.firstName,
			dto.lastName,
			dto.email,
			dto.expiry,
			undefined,
			undefined,
			undefined,
			dto.userType,
		);
	}
}
