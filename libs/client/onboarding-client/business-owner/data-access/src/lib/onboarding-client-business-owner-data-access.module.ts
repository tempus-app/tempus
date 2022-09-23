import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BUSINESS_OWNER_FEATURE_KEY, reducers } from './+state';
import { ResourceProjectClientManagementEffects } from './+state/resProjClientManagement/resProjClientManagement.effects';
import { ViewResourceEffects } from './+state/viewResources/viewResource.effects';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(BUSINESS_OWNER_FEATURE_KEY, reducers),
		EffectsModule.forFeature([ResourceProjectClientManagementEffects, ViewResourceEffects]),
	],
})
export class OnboardingClientBusinessOwnerDataAccessModule {}
