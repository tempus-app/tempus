import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClientOnboardingClientSharedFeaturesFeatureEditViewTimesheetModule } from '@tempus/client/onboarding-client/shared/features/feature-edit-view-timesheet';
import { MatDialogModule } from '@angular/material/dialog';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { EditTimesheetComponent } from './edit-timesheet/edit-timesheet.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/resource/profile/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatDialogModule,
		MatTooltipModule,
		MatSlideToggleModule,
		FlexLayoutModule,
		MatFormFieldModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedInputResourceInformationModule,
		ClientSharedPresentationalResourceDisplayModule,
		ClientOnboardingClientSharedFeaturesFeatureEditViewTimesheetModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: TimesheetComponent,
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
	declarations: [TimesheetComponent, EditTimesheetComponent],
})
export class ClientOnboardingClientResourceFeaturesFeatureViewTimesheetModule {}
