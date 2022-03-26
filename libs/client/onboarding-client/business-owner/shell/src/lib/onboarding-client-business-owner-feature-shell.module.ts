import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@tempus/client/onboarding-client/shared/guards';
import { BusinessOnwerShellComponent } from './shell/onboarding-client-business-owner-feature-shellcomponent';

const routes: Routes = [
	{
		path: '',
		component: BusinessOnwerShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'manage-resources' },
			{
				path: 'manage-resources',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
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
