import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClientProfileDataAccessModule } from '@tempus/client/onboarding-client/resource/data-access';
import { AuthGuard } from '@tempus/client/onboarding-client/resource/guards';
import { ResourceShellComponent } from './shell/onboarding-client-resource-feature-shell.component';

const routes: Routes = [
	{
		path: '',
		component: ResourceShellComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				canLoad: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-profile').then(
						m => m.OnboardingClientResourceFeatureProfileModule,
					),
			},
			{
				path: 'signin',
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-sign-in').then(
						m => m.OnboardingClientResourceFeatureSignInModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [ResourceShellComponent],
	imports: [CommonModule, RouterModule.forChild(routes), OnboardingClientProfileDataAccessModule],
})
export class OnboardingClientResourceFeatureShellModule {}
