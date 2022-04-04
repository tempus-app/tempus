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
import { ManageResourcesComponent } from './manage-resources/manage-resources.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/manage-resources/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsInputModule,
		MatFormFieldModule,
		MatIconModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsInputModule,
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
	declarations: [ManageResourcesComponent],
})
export class OnboardingClientBusinessOwnerFeatureManageResourcesModule {}
