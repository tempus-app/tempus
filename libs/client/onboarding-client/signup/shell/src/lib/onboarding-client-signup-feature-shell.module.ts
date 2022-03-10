import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { SignupShellComponent } from './shell/onboarding-client-signup-feature-shell.component';

const routes: Routes = [
	{
		path: '',
		component: SignupShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'credentials' },
			{
				path: 'credentials',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-create-credentials').then(
						m => m.OnboardingClientSignupFeatureCreateCredentialsModule,
					),
			},
			{
				path: 'uploadresume',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-upload-resume').then(
						m => m.OnboardingClientSignupFeatureUploadResumeModule,
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
			{
				path: 'myinfothree',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-three').then(
						m => m.OnboardingClientSignupFeatureMyInfoThreeModule,
					),
			},
			{
				path: 'review',
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-review-info').then(
						m => m.OnboardingClientSignupFeatureReviewInfoModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [SignupShellComponent],
	imports: [CommonModule, RouterModule.forChild(routes), ClientSharedUiComponentsPersistentModule, MatButtonModule],
})
export class OnboardingClientSignupFeatureShellModule {}
