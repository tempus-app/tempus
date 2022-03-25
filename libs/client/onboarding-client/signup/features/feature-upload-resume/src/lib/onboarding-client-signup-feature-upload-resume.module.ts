import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { ConfirmResumeUploadComponent } from './confirm-resume-upload/confirm-resume-upload.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/uploadresume/', '.json');
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
		MatFormFieldModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResumeUploadComponent,
			},
		]),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			extend: true,
			isolate: false,
		}),
	],
	declarations: [ConfirmResumeUploadComponent, ResumeUploadComponent],
})
export class OnboardingClientSignupFeatureUploadResumeModule {}
