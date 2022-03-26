import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { OnboardingClientSharedDataAccessModule } from '@tempus/client/onboarding-client/shared/data-access';
// import { ValidLinkGuard } from '@tempus/client/onboarding-client/signup/guards';
import { OnboardingClientSignupDataAccessModule } from '@tempus/client/onboarding-client/signup/data-access';
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
				// canLoad: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-upload-resume').then(
						m => m.OnboardingClientSignupFeatureUploadResumeModule,
					),
			},
			{
				path: 'myinfoone',
				// canLoad: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-one').then(
						m => m.OnboardingClientSignupFeatureMyInfoOneModule,
					),
			},
			{
				path: 'myinfotwo',
				// canLoad: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-two').then(
						m => m.OnboardingClientSignupFeatureMyInfoTwoModule,
					),
			},
			{
				path: 'myinfothree',
				// canLoad: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-three').then(
						m => m.OnboardingClientSignupFeatureMyInfoThreeModule,
					),
			},
			{
				path: 'review',
				// canLoad: [ValidLinkGuard],
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
	imports: [
		CommonModule,
		OnboardingClientSignupDataAccessModule,
		OnboardingClientSharedDataAccessModule,
		RouterModule.forChild(routes),
		ClientSharedUiComponentsPersistentModule,
		MatButtonModule,
	],
})
export class OnboardingClientSignupFeatureShellModule {}
