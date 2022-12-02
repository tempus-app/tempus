import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ClientSharedPresentationalLandingModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/landing';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/', '.json');
}
@NgModule({
	imports: [
		CommonModule,
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedPresentationalLandingModule,
		ClientSharedUiComponentsModalModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResetPasswordComponent,
			},
		]),
	],
	declarations: [ResetPasswordComponent],
})
export class OnboardingClientSharedFeatureResetPasswordModule {}
