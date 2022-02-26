import { Module } from '@nestjs/common';
import { AccountModule } from '@tempus/api-account';
import { DataLayerModule } from '@tempus/datalayer';
import { ProfileResumeController } from './controllers/profile-resume.controller';
import { ProfileViewController } from './controllers/profile-view.controller';
import { CertificationService } from './services';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { SkillsService } from './services/skill.service';
import { ViewsService } from './services/view.service';

@Module({
  imports: [DataLayerModule, AccountModule],
  controllers: [ProfileResumeController, ProfileViewController],
  providers: [EducationService, ExperienceService, SkillsService, ViewsService, CertificationService],
  exports: [],
})
export class ProfileModule {}
