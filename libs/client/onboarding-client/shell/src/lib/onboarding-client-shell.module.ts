import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClientShellComponent } from './shell/onboarding-client-shell.component';

const routes: Routes = [
	{
		path: '',
		component: OnboardingClientShellComponent,
		children: [
			{
				path: 'signup/token',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/shell').then(m => m.OnboardingClientSignupFeatureShellModule),
			},
			{
				path: 'profile',
				loadChildren: () =>
					import('@tempus/onboarding-client/profile/shell').then(m => m.OnboardingClientProfileFeatureShellModule),
			},
		],
	},
];

@NgModule({
	declarations: [OnboardingClientShellComponent],
	imports: [CommonModule, RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class OnboardingClientShellModule {}
