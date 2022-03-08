import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmResumeUploadComponent } from './confirm-resume-upload/confirm-resume-upload.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatIconModule,
		MatButtonModule,
		MatGridListModule,
		MatCardModule,
		MatFormFieldModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResumeUploadComponent,
			},
		]),
	],
	declarations: [ConfirmResumeUploadComponent, ResumeUploadComponent],
	exports: [ResumeUploadComponent],
})
export class OnboardingClientSignupFeatureUploadResumeModule {}
