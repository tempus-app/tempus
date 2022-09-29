import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { OnboardingClientSharedFeatureSecondaryViewFormModule } from '@tempus/onboarding-client/shared/feature-secondary-view-form';
import { MyViewsComponent } from './my-views/my-views.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		OnboardingClientSharedFeatureSecondaryViewFormModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyViewsComponent,
			},
		]),
	],
	declarations: [MyViewsComponent],
})
export class OnboardingClientResourceFeatureViewsModule {}
