import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingClientSharedDataAccessModule } from '@tempus/client/onboarding-client/shared/data-access';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PROFILE_FEATURE_KEY, reducers } from './+state';
import { AuthEffects } from './+state/auth/auth.effects';
import { hydrationMetaReducer } from './+state/hydration.reducer';

@NgModule({
	imports: [
		CommonModule,
		OnboardingClientSharedDataAccessModule,
		StoreModule.forFeature(PROFILE_FEATURE_KEY, reducers, { metaReducers: [hydrationMetaReducer] }),
		EffectsModule.forFeature([AuthEffects]),
	],
})
export class OnboardingClientProfileDataAccessModule {}
