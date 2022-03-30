import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatTooltipModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedInputResourceInformationModule,
		ClientSharedPresentationalResourceDisplayModule,
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
export class OnboardingClientResourceFeatureProfileModule {}
