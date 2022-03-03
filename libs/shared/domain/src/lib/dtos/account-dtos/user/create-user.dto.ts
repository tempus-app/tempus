import { ApiProperty } from '@nestjs/swagger';
import { IsISO31661Alpha2, IsOptional } from 'class-validator';
import exp = require('constants');
import { RoleType, ViewType } from '../../../enums';
import { UserEntity } from '../../../entities/account-entities/user.entity';
import { ResourceEntity } from '../../../entities/account-entities/resource.entity';
import { CreateCertificationDto } from '../../profile-dtos/certification/createCertification.dto';
import { CreateEducationDto } from '../../profile-dtos/education/createEduation.dto';
import { CreateExperienceDto } from '../../profile-dtos/experience/createExperience.dto';
import { CreateSkillDto } from '../../profile-dtos/skill/createSkill.dto';
import { CreateViewDto } from '../../profile-dtos/view/createView.dto';
import { CreateLocationDto } from '../../common-dtos/createLocation.dto';
import { CreateProjectDto } from '../../project-dtos/project/createProject.dto';

import { LocationEntity } from '../../../entities/common-entities/location.entity';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity } from '../../..';

export class CreateUserDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ enum: ['BUSINESS_OWNER', 'SUPERVISOR'] })
	roles: RoleType[];

	constructor(firstName: string, lastName: string, email: string, password: string, roles: RoleType[]) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	}

	public static toEntity(dto: CreateUserDto): UserEntity | ResourceEntity {
		if (dto == null) return new UserEntity();
		return new UserEntity(null, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles);
	}
}
