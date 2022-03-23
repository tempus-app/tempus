import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClientProfileDataAccessModule } from '@tempus/client/onboarding-client/profile/data-access';
import { AuthGuard } from '@tempus/client/onboarding-client/profile/guards';
import { ProfileShellComponent } from './shell/onboarding-client-profile-feature-shell.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileShellComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				//canLoad: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/profile/feature-profile').then(
						m => m.OnboardingClientProfileFeatureProfileModule,
					),
			},
			{
				path: 'signin',
				loadChildren: () =>
					import('@tempus/onboarding-client/profile/feature-sign-in').then(
						m => m.OnboardingClientSignupFeatureSignInModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [ProfileShellComponent],
	imports: [CommonModule, RouterModule.forChild(routes), OnboardingClientProfileDataAccessModule],
})
export class OnboardingClientProfileFeatureShellModule {}
