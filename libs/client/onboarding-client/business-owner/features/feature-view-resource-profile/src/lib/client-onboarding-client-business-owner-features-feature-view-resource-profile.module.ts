import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ResourceProfileComponent } from './resource-profile/resource-profile.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResourceProfileComponent,
			},
		]),
	],
	declarations: [ResourceProfileComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureViewResourceProfileModule {}
