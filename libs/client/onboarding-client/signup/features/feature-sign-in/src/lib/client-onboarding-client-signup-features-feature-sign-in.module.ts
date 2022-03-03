import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { SignInComponent } from './signin/sign-in.component';

@NgModule({
	imports: [CommonModule, ClientSharedUiComponentsInputModule, ClientSharedUiComponentsPresentationalModule],
	declarations: [SignInComponent],
	exports: [SignInComponent],
})
export class ClientOnboardingClientSignupFeaturesFeatureSignInModule {}
