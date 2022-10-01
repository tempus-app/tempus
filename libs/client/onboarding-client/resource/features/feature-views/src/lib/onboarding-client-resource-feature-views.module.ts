import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { OnboardingClientSharedFeatureEditViewFormModule } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { MyViewsComponent } from './my-views/my-views.component';
import { CreateNewViewComponent } from './create-new-view/create-new-view.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		OnboardingClientSharedFeatureEditViewFormModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyViewsComponent,
			},
			{
				path: 'new',
				pathMatch: 'full',
				component: CreateNewViewComponent,
			},
		]),
	],
	declarations: [MyViewsComponent, CreateNewViewComponent],
})
export class OnboardingClientResourceFeatureViewsModule {}
