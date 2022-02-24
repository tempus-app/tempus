import { RoleType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../../entities/account-entities/user.entity'
import { IsOptional } from 'class-validator'
import { ResourceEntity } from '../../../entities/account-entities/resource.entity'
import {
  CreateCertificationDto,
  CreateEducationDto,
  CreateExperienceDto,
  CreateLocationDto,
  CreateProjectDto,
  CreateSkillDto,
  CreateViewDto,
} from '../..'
import exp = require('constants')
import { LocationEntity } from '../../../entities/common-entities/location.entity'

export class CreateUserDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR'] })
  roles: RoleType[]

  @ApiProperty()
  @IsOptional()
  phoneNumber?: string

  @ApiProperty()
  @IsOptional()
  title?: string

  @ApiProperty()
  @IsOptional()
  location?: CreateLocationDto

  @ApiProperty()
  @IsOptional()
  projects?: CreateProjectDto[]

  @ApiProperty()
  @IsOptional()
  views?: CreateViewDto[]

  @ApiProperty()
  @IsOptional()
  experiences?: CreateExperienceDto[]

  @ApiProperty()
  @IsOptional()
  educations?: CreateEducationDto[]

  @ApiProperty()
  @IsOptional()
  skills?: CreateSkillDto[]

  @ApiProperty()
  @IsOptional()
  certifications?: CreateCertificationDto[]

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: RoleType[],
    phoneNumber?: string,
    title?: string,
    location?: CreateLocationDto,
    projects?: CreateProjectDto[],
    views?: CreateViewDto[],
    experiences?: CreateExperienceDto[],
    educations?: CreateEducationDto[],
    skills?: CreateSkillDto[],
    certifications?: CreateCertificationDto[],
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.roles = roles
    this.phoneNumber = phoneNumber ? phoneNumber : null
    this.title = title ? title : null
    this.location = location ? location : null
    this.projects = projects ? projects : []
    this.views = views ? views : []
    this.experiences = experiences ? experiences : []
    this.educations = educations ? educations : []
    this.skills = skills ? skills : []
    this.certifications = certifications ? certifications : []
  }

  public static toEntity(dto: CreateUserDto): UserEntity {
    if (dto == null) return new UserEntity()
    if (dto.phoneNumber)
      return new ResourceEntity(
        null,
        dto.phoneNumber,
        dto.title,
        new LocationEntity(),
        [],
        [],
        [],
        [],
        [],
        [],
        dto.firstName,
        dto.lastName,
        dto.email,
        dto.password,
        dto.roles,
      )
    return new UserEntity(null, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles)
  }
}
