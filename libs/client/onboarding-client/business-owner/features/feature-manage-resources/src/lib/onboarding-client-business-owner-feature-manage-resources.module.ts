import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientOnboardingSharedProjectModule } from '@tempus/client/onboarding-client/shared/ui-components/project';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ManageResourcesComponent } from './manage-resources/manage-resources.component';
import { FilterResourcesComponent } from './filter-resources/filter-resources.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/manage-resources/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsInputModule,
		ClientOnboardingSharedProjectModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatExpansionModule,
		MatMenuModule,
		MatChipsModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		ClientSharedUiComponentsModalModule,
		FlexLayoutModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ManageResourcesComponent,
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
	declarations: [ManageResourcesComponent, FilterResourcesComponent],
})
export class OnboardingClientBusinessOwnerFeatureManageResourcesModule {}
