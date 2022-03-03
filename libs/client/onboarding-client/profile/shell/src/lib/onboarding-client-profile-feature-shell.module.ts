import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileShellComponent } from './shell/onboarding-client-profile-feature-shell.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileShellComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'signin',
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
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class OnboardingClientProfileFeatureShellModule {}
