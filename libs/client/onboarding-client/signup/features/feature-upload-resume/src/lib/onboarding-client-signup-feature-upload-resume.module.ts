import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmResumeUploadComponent } from './confirm-resume-upload/confirm-resume-upload.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/uploadResume', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatIconModule,
		FlexLayoutModule,
		MatButtonModule,
		MatGridListModule,
		MatCardModule,
		MatProgressBarModule,
		MatFormFieldModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResumeUploadComponent,
			},
		]),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	declarations: [ConfirmResumeUploadComponent, ResumeUploadComponent],
})
export class OnboardingClientSignupFeatureUploadResumeModule {}
