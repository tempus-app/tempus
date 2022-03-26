import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ONBOARDING_CLIENT_FEATURE_KEY, reducers } from './+state';
import { hydrationMetaReducer } from './+state/hydration.reducer';
import { AuthEffects } from './+state/auth/auth.effects';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(ONBOARDING_CLIENT_FEATURE_KEY, reducers, { metaReducers: [hydrationMetaReducer] }),
		EffectsModule.forFeature([AuthEffects]),
	],
})
export class OnboardingClientSharedDataAccessModule {}
