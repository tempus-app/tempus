import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { OnboardingClientSharedFeatureEditViewFormModule } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MyProjectsDisplayComponent } from './my-projects-display/my-projects-display.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/resource/projects/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatGridListModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsPresentationalModule,
		OnboardingClientSharedFeatureEditViewFormModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyProjectsDisplayComponent,
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
	declarations: [MyProjectsDisplayComponent],
})
export class OnboardingClientResourceMyProjectsFeature {}
