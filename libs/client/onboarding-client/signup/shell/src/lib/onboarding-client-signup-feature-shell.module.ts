import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ValidLinkGuard } from '@tempus/client/onboarding-client/signup/guards';
import { OnboardingClientSignupDataAccessModule } from '@tempus/client/onboarding-client/signup/data-access';
import { TranslateModule } from '@ngx-translate/core';
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
				canLoad: [ValidLinkGuard],
				canActivate: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-upload-resume').then(
						m => m.OnboardingClientSignupFeatureUploadResumeModule,
					),
			},
			{
				path: 'myinfoone',
				canLoad: [ValidLinkGuard],
				canActivate: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-one').then(
						m => m.OnboardingClientSignupFeatureMyInfoOneModule,
					),
			},
			{
				path: 'myinfotwo',
				canLoad: [ValidLinkGuard],
				canActivate: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-two').then(
						m => m.OnboardingClientSignupFeatureMyInfoTwoModule,
					),
			},
			{
				path: 'myinfothree',
				canLoad: [ValidLinkGuard],
				canActivate: [ValidLinkGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/signup/feature-myinfo-three').then(
						m => m.OnboardingClientSignupFeatureMyInfoThreeModule,
					),
			},
			{
				path: 'review',
				canLoad: [ValidLinkGuard],
				canActivate: [ValidLinkGuard],
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
		RouterModule.forChild(routes),
		ClientSharedUiComponentsPersistentModule,
		MatButtonModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
})
export class OnboardingClientSignupFeatureShellModule {}
