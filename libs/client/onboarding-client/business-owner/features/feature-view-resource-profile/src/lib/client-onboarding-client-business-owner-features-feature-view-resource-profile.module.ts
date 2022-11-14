import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { OnboardingClientSharedFeatureEditViewFormModule } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClientOnboardingSharedProjectModule } from '@tempus/client/onboarding-client/shared/ui-components/project';
import { ResourceProfileComponent } from './resource-profile/resource-profile.component';
import { UserBarComponent } from './user-bar/user-bar.component';
import { ResourceProfileContentComponent } from './resource-profile-content/resource-profile-content.component';
import { BusinessOwnerCreateNewViewComponent } from './create-new-view/create-new-view.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/view-resource-profile/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsInputModule,
		MatDialogModule,
		FormsModule,
		ClientSharedUiComponentsModalModule,
		ReactiveFormsModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedPresentationalResourceDisplayModule,
		ClientOnboardingSharedProjectModule,
		OnboardingClientSharedFeatureEditViewFormModule,
		MatIconModule,
		MatFormFieldModule,
		FlexLayoutModule,
		MatButtonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ResourceProfileComponent,
			},
			{
				path: 'new',
				pathMatch: 'full',
				component: BusinessOwnerCreateNewViewComponent,
			},
		]),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	declarations: [
		ResourceProfileComponent,
		UserBarComponent,
		ResourceProfileContentComponent,
		BusinessOwnerCreateNewViewComponent,
	],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureViewResourceProfileModule {}
