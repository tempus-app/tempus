import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, RESOURCE_FEATURE_KEY } from './+state';
import { TestEffects } from './+state/resource/resource.effects';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(RESOURCE_FEATURE_KEY, reducers),
		EffectsModule.forFeature([TestEffects]),
	],
})
export class OnboardingClientResourceDataAccessModule {}
