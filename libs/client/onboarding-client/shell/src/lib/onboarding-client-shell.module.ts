import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClientSharedDataAccessModule } from '@tempus/client/onboarding-client/shared/data-access';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { OnboardingClientShellComponent } from './shell/onboarding-client-shell.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/', '.json');
}

const routes: Routes = [
	{
		path: '',
		component: OnboardingClientShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'signin' },
			{
				path: 'signin',
				loadChildren: () =>
					import('@tempus/onboarding-client/shared/feature-sign-in').then(m => m.OnboardingClientFeatureSignInModule),
			},
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
	imports: [
		CommonModule,
		OnboardingClientSharedDataAccessModule,
		RouterModule.forRoot(routes),
		TranslateModule.forRoot({
			defaultLanguage: 'en',
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	exports: [RouterModule],
})
export class OnboardingClientShellModule {}
