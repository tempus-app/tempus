import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OnboardingClientSharedDataAccessModule } from '@tempus/client/onboarding-client/shared/data-access';
import { LinkEffects } from './+state/link/link.effects';
import { ResourceEffects } from './+state/resource/resource.effects';
import { reducers, SIGNUP_FEATURE_KEY } from './+state/signup.state';

@NgModule({
	imports: [
		CommonModule,
		OnboardingClientSharedDataAccessModule,
		StoreModule.forFeature(SIGNUP_FEATURE_KEY, reducers),
		EffectsModule.forFeature([LinkEffects, ResourceEffects]),
	],
})
export class OnboardingClientSignupDataAccessModule {}
