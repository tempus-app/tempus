import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessOnwerShellComponent } from './shell/onboarding-client-business-owner-feature-shellcomponent';

const routes: Routes = [
	{
		path: '',
		component: BusinessOnwerShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'manage-resources' },
			{
				path: 'manage-resources',
				loadChildren: () =>
					import('@tempus/onboarding-client/business-owner/feature-manage-resources').then(
						m => m.OnboardingClientBusinessOwnerFeatureManageResourcesModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [BusinessOnwerShellComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class OnboardingBusinessOwnerFeatureShellModule {}
