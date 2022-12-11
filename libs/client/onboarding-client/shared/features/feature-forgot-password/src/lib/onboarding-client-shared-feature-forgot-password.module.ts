import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { ClientSharedPresentationalLandingModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/landing';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/', '.json');
}
@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
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
				component: ForgotPasswordComponent,
			},
		]),
	],
	declarations: [ForgotPasswordComponent],
})
export class OnboardingClientSharedFeatureForgotPasswordModule {}
