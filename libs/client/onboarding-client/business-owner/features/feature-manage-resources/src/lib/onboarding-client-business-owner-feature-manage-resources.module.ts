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
import { ManageResourcesComponent } from './manage-resources/manage-resources.component';
import { CreateProjectModalComponent } from './manage-resources/create-project-modal/create-project-modal.component';

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
		MatButtonModule,
		MatTooltipModule,
		MatSlideToggleModule,
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
	declarations: [ManageResourcesComponent, CreateProjectModalComponent],
})
export class OnboardingClientBusinessOwnerFeatureManageResourcesModule {}
