import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { WorkExperienceComponent } from './components/work-experience/work-experience.component';
import { EducationComponent } from './components/education/education.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { SkillsComponent } from './components/skills/skills.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatGridListModule,
		MatFormFieldModule,
		MatButtonModule,
		MatTooltipModule,
		MatChipsModule,
		MatIconModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
	],
	declarations: [
		PersonalInformationComponent,
		WorkExperienceComponent,
		EducationComponent,
		CertificationsComponent,
		SkillsComponent,
	],
	exports: [
		PersonalInformationComponent,
		WorkExperienceComponent,
		EducationComponent,
		CertificationsComponent,
		SkillsComponent,
	],
})
export class ClientSharedInputResourceInformationModule {}
