import { forwardRef, Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ProfileResumeController } from './controllers/profile-resume.controller';
import { ProfileViewController } from './controllers/profile-view.controller';
import { CertificationService } from './services';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { SkillsService } from './services/skill.service';
import { ViewsService } from './services/view.service';

@Module({
	imports: [ApiSharedEntityModule, forwardRef(() => AccountModule), CommonModule],
	controllers: [ProfileResumeController, ProfileViewController],
	providers: [EducationService, ExperienceService, SkillsService, ViewsService, CertificationService],
	exports: [EducationService, ExperienceService, SkillsService, ViewsService, CertificationService],
})
export class ProfileModule {}
