import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClientSharedDataAccessModule } from '@tempus/client/onboarding-client/shared/data-access';
import { OnboardingClientShellComponent } from './shell/onboarding-client-shell.component';

const routes: Routes = [
	{
		path: '',
		component: OnboardingClientShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'resource/signin' },
			{
				path: 'signup/:token',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/shell').then(m => m.OnboardingClientSignupFeatureShellModule),
			},
			{
				path: 'resource',
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/shell').then(m => m.OnboardingClientResourceFeatureShellModule),
			},
			{
				path: 'owner',
				loadChildren: () =>
					import('@tempus/onboarding-client/business-owner/shell').then(
						m => m.OnboardingBusinessOwnerFeatureShellModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [OnboardingClientShellComponent],
	imports: [CommonModule, OnboardingClientSharedDataAccessModule, RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class OnboardingClientShellModule {}
