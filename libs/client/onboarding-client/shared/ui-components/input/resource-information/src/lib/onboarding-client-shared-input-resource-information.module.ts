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
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { EducationComponent } from './education/education.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatGridListModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatButtonModule,
		MatTooltipModule,
		MatChipsModule,
		MatIconModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
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
