import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
import { ResourceProfileComponent } from './resource-profile/resource-profile.component';
import { UserBarComponent } from './user-bar/user-bar.component';
import { ResourceProfileContentComponent } from './resource-profile-content/resource-profile-content.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedPresentationalResourceDisplayModule,
		MatIconModule,
		FlexLayoutModule,
		MatButtonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResourceProfileComponent,
			},
		]),
	],
	declarations: [ResourceProfileComponent, UserBarComponent, ResourceProfileContentComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureViewResourceProfileModule {}
