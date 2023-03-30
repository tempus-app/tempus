import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
	LinkEntity,
	ResourceEntity,
	UserEntity,
	LocationEntity,
	CertificationEntity,
	EducationEntity,
	ExperienceEntity,
	RevisionEntity,
	SkillEntity,
	SkillTypeEntity,
	ViewEntity,
	ClientEntity,
	ProjectEntity,
	ClientRepresentativeEntity,
	ProjectResourceEntity,
	PasswordResetEntity,
	CalendarEntity,
	RevisedTimesheetEntity,
	TimesheetEntity,
	ApprovalEntity,
} from './entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			LinkEntity,
			ResourceEntity,
			UserEntity,
			LocationEntity,
			CertificationEntity,
			EducationEntity,
			ExperienceEntity,
			RevisionEntity,
			SkillEntity,
			SkillTypeEntity,
			ViewEntity,
			ClientEntity,
			ProjectEntity,
			ClientRepresentativeEntity,
			ProjectResourceEntity,
			PasswordResetEntity,
			CalendarEntity,
			RevisedTimesheetEntity,
			TimesheetEntity,
			ApprovalEntity,
		]),
	],
	controllers: [],
	providers: [],
	exports: [TypeOrmModule],
})
export class ApiSharedEntityModule {}
