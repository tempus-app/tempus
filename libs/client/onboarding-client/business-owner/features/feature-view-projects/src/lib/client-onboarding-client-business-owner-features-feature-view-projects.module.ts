import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientOnboardingSharedProjectModule } from '@tempus/client/onboarding-client/shared/ui-components/project';
import { ViewProjectsComponent } from './view-projects/view-projects.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/view-projects/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsPersistentModule,
		ClientOnboardingSharedProjectModule,
		ClientSharedUiComponentsInputModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ViewProjectsComponent,
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
	declarations: [ViewProjectsComponent],
})
export class OnboardingClientBusinessOwnerFeatureViewProjectsModule {}
