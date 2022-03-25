import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CredentialsComponent } from './credentials/credentials.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingCtaComponent } from './landing-cta/landing-cta.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/credentials/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		MatDialogModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
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
			extend: true,
			isolate: false,
		}),
	],
	declarations: [CredentialsComponent, SignUpComponent, LandingCtaComponent],
})
export class OnboardingClientSignupFeatureCreateCredentialsModule {}
