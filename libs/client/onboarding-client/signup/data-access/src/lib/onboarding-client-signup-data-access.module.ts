import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LinkEffects } from './+state/link/link.effects';
import { ResourceEffects } from './+state/createResource/createResource.effects';
import { reducers, SIGNUP_FEATURE_KEY } from './+state/signup.state';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(SIGNUP_FEATURE_KEY, reducers),
		EffectsModule.forFeature([LinkEffects, ResourceEffects]),
	],
})
export class OnboardingClientSignupDataAccessModule {}
