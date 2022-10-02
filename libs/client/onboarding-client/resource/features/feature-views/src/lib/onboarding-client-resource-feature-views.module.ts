import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { OnboardingClientSharedFeatureEditViewFormModule } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyViewsComponent } from './my-views/my-views.component';
import { CreateNewViewComponent } from './create-new-view/create-new-view.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/resource/views/', '.json');
}

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
	declarations: [MyViewsComponent, CreateNewViewComponent],
})
export class OnboardingClientResourceFeatureViewsModule {}
