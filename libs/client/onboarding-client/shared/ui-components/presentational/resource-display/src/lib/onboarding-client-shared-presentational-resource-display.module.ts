import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { TranslateModule } from '@ngx-translate/core';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { EducationComponent } from './education/education.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectComponent } from './project/project.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatGridListModule,
		MatFormFieldModule,
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
		ProjectComponent,
  TimesheetComponent,
	],
	exports: [
		PersonalInformationComponent,
		WorkExperienceComponent,
		EducationComponent,
		CertificationsComponent,
		SkillsComponent,
		ProjectComponent,
	],
})
export class ClientSharedPresentationalResourceDisplayModule {}
