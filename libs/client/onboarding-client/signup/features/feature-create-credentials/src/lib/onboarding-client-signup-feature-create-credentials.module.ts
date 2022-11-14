import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClientSharedPresentationalLandingModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/landing';
import { CredentialsComponent } from './credentials/credentials.component';
import { SignUpComponent } from './sign-up/sign-up.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/credentials/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedPresentationalLandingModule,
		FlexLayoutModule,
		MatButtonModule,
		MatFormFieldModule,
		MatCheckboxModule,
		FormsModule,
		ReactiveFormsModule,

		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: CredentialsComponent,
			},
		]),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	declarations: [CredentialsComponent, SignUpComponent],
})
export class OnboardingClientSignupFeatureCreateCredentialsModule {}
