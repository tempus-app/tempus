import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../enums';
import { UserEntity } from '../../../entities/account-entities/user.entity';
import { ResourceEntity } from '../../..';

export class EditUserDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR'] })
	roles: RoleType[];

	@ApiProperty()
	@IsOptional()
	phoneNumber?: string;

	@ApiProperty()
	@IsOptional()
	title?: string;

	constructor(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		roles: RoleType[],
		phoneNumber?: string,
		title?: string,
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
		this.phoneNumber = phoneNumber || null;
		this.title = title || null;
	}

	public static toEntity(dto: EditUserDto): UserEntity {
		if (dto == null) return new UserEntity();
		if (dto) {
			return new ResourceEntity(
				null,
				dto.phoneNumber,
				dto.title,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				dto.firstName,
				dto.lastName,
				dto.email,
				dto.password,
				dto.roles,
			);
		}
		return new UserEntity(null, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles);
	}
}
