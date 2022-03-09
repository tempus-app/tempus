import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CredentialsComponent } from './credentials/credentials.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingCtaComponent } from './landing-cta/landing-cta.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		FlexLayoutModule,
		MatButtonModule,
		MatFormFieldModule,

		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: CredentialsComponent,
			},
		]),
	],
	declarations: [CredentialsComponent, SignUpComponent, LandingCtaComponent],
})
export class OnboardingClientSignupFeatureCreateCredentialsModule {}
