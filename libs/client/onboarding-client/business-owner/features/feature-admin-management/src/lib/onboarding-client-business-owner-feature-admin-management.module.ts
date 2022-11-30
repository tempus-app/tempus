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
import { AdminManagementComponent } from './admin-management/admin-management.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/admin-management/', '.json');
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
		ClientSharedUiComponentsModalModule,
		FlexLayoutModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: AdminManagementComponent,
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
	declarations: [AdminManagementComponent],
})
export class OnboardingClientBusinessOwnerFeatureAdminManagementModule {}
