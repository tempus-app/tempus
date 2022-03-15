import { CreateUserDto, RoleType, UpdateUserDto, User } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'user_type' } })
export class UserEntity implements User {
	constructor(
		id?: number,
		firstName?: string,
		lastName?: string,
		email?: string,
		password?: string,
		roles?: RoleType[],
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	refreshToken: string;

	@Column({
		type: 'enum',
		enum: RoleType,
		array: true,
		default: [RoleType.USER],
	})
	roles: RoleType[];

	public static fromDto(dto: CreateUserDto | UpdateUserDto): UserEntity {
		if (dto == null) return new UserEntity();
		const id = dto instanceof CreateUserDto ? undefined : dto.id;
		return new UserEntity(id, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles);
	}
}
