import { forwardRef, Module } from '@nestjs/common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { DataLayerModule } from '@tempus/shared-domain';
import { ProfileResumeController } from './controllers/profile-resume.controller';
import { ProfileViewController } from './controllers/profile-view.controller';
import { CertificationService } from './services';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { SkillsService } from './services/skill.service';
import { ViewsService } from './services/view.service';

@Module({
	imports: [DataLayerModule, forwardRef(() => AccountModule)],
	controllers: [ProfileResumeController, ProfileViewController],
	providers: [EducationService, ExperienceService, SkillsService, ViewsService, CertificationService],
	exports: [EducationService, ExperienceService, SkillsService, ViewsService, CertificationService],
})
export class ProfileModule {}
