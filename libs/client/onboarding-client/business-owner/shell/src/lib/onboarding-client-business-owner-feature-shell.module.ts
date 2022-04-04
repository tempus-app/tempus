import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@tempus/client/onboarding-client/shared/guards';
import { OnboardingClientBusinessOwnerDataAccessModule } from '@tempus/client/onboarding-client/business-owner/data-access';
import { TranslateModule } from '@ngx-translate/core';
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
			{
				path: 'view-resources/:id',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/client/onboarding-client/business-owner/features/feature-view-resource-profile').then(
						m => m.ClientOnboardingClientBusinessOwnerFeaturesFeatureViewResourceProfileModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [BusinessOnwerShellComponent],
	imports: [
		OnboardingClientBusinessOwnerDataAccessModule,
		CommonModule,
		RouterModule.forChild(routes),
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
})
export class OnboardingBusinessOwnerFeatureShellModule {}
