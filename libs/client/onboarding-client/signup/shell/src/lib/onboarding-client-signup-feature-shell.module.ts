import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupShellComponent } from './shell/onboarding-client-signup-feature-shell.component';

const routes: Routes = [
	{
		path: 'test',
		component: SignupShellComponent,
		children: [
			{
				path: 'signup',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-sign-in').then(
						m => m.OnboardingClientSignupFeatureSignInModule,
					),
			},
			{
				path: 'myinfoone',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-one').then(
						m => m.OnboardingClientSignupFeatureMyInfoOneModule,
					),
			},
			{
				path: 'myinfotwo',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-two').then(
						m => m.OnboardingClientSignupFeatureMyInfoTwoModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [SignupShellComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class OnboardingClientSignupFeatureShellModule {}
