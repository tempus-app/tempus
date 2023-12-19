import { CreateUserDto, UpdateUserDto } from '@tempus/api/shared/dto';
import { RoleType, User } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm';
import { TimesheetEntity } from '../timesheet-entities';

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
		supervisedTimesheets?: TimesheetEntity[],
		active?: boolean,
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
		this.supervisedTimesheets = supervisedTimesheets;
		this.active = active;
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

	@Column({ nullable: true })
	active: boolean;

	@Column({
		type: 'enum',
		enum: RoleType,
		array: true,
		default: [RoleType.USER],
	})
	roles: RoleType[];

	@OneToMany(() => TimesheetEntity, timesheet => timesheet.supervisor)
	supervisedTimesheets: TimesheetEntity[];

	public static fromDto(dto: CreateUserDto | UpdateUserDto): UserEntity {
		if (dto == null) return new UserEntity();
		const id = dto instanceof CreateUserDto ? undefined : dto.id;
		return new UserEntity(
			id,
			dto.firstName,
			dto.lastName,
			dto.email,
			dto.password,
			dto.roles,
			undefined,
			dto.active,
		);
	}
}
