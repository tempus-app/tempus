import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileResumeController } from './controllers/profile-resume.controller'
import { ProfileViewController } from './controllers/profile-view.controller'
import {
  RevisionEntity,
  ViewEntity,
  SkillEntity,
  EducationEntity,
  SkillTypeEntity,
  CertificationEntity,
} from './entities'
import { EducationService } from './services/education.service'
import { ExperienceService } from './services/experience.service'
import { SkillsService } from './services/skill.service'
import { ViewsService } from './services/view.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ViewEntity,
      SkillEntity,
      EducationEntity,
      RevisionEntity,
      SkillTypeEntity,
      CertificationEntity,
    ]),
  ],
  controllers: [ProfileResumeController, ProfileViewController],
  providers: [EducationService, ExperienceService, SkillsService, ViewsService],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
