import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { OnboardingClientResourceDataAccessModule } from '@tempus/client/onboarding-client/resource/data-access';
import { AuthGuard } from '@tempus/client/onboarding-client/shared/guards';
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
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-profile').then(
						m => m.OnboardingClientResourceFeatureProfileModule,
					),
			},
			{
				path: 'personal-information',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-personal-information').then(
						m => m.OnboardingClientResourceFeaturePersonalInformationModule,
					),
			},
			{
				path: 'my-views',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-views').then(
						m => m.OnboardingClientResourceFeatureViewsModule,
					),
			},
			{
				path: 'my-projects',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-my-projects').then(
						m => m.OnboardingClientResourceMyProjectsFeature,
					),
			},
			{
				path: 'my-views/:id',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/resource/feature-profile').then(
						m => m.OnboardingClientResourceFeatureProfileModule,
					),
			},
		],
	},
];

@NgModule({
	declarations: [ResourceShellComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		OnboardingClientResourceDataAccessModule,
		ClientSharedUiComponentsPersistentModule,
	],
})
export class OnboardingClientResourceFeatureShellModule {}
