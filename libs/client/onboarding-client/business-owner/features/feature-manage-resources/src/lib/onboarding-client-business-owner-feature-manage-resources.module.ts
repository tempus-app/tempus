import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ManageResourcesComponent } from './manage-resources/manage-resources.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ManageResourcesComponent,
			},
		]),
	],
})
export class OnboardingClientBusinessOwnerFeatureManageResourcesModule {}
