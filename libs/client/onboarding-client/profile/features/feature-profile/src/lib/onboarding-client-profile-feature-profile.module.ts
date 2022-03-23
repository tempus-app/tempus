import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { OnboardingClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';

@NgModule({
	imports: [
		CommonModule,
		OnboardingClientSharedPresentationalResourceDisplayModule,
		ClientSharedUiComponentsPresentationalModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ProfileComponent,
			},
		]),
	],
	declarations: [ProfileComponent],
})
export class OnboardingClientProfileFeatureProfileModule {}
