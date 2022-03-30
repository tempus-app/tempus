import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { BUSINESS_OWNER_FEATURE_KEY, reducers } from './+state';
import { EffectsModule } from '@ngrx/effects';
import { TestEffects } from './+state/test/test.effects';

@NgModule({
	imports: [
		CommonModule, 
		StoreModule.forFeature(BUSINESS_OWNER_FEATURE_KEY, reducers),
		EffectsModule.forFeature([TestEffects]),
	],
})
export class OnboardingClientBusinessOwnerDataAccessModule {}
