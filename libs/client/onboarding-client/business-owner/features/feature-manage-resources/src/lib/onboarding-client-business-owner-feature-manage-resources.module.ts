import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManageResourcesComponent } from './manage-resources/manage-resources.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ManageResourcesComponent,
			},
		]),
	],
	declarations: [ManageResourcesComponent],
})
export class OnboardingClientBusinessOwnerFeatureManageResourcesModule {}
