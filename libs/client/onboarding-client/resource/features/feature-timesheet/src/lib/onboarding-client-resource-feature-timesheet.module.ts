import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OnboardingClientSharedFeatureEditViewFormModule } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CreateNewTimesheetComponent } from './create-new-timesheet/create-new-timesheet.component';
import { ClientOnboardingClientSharedFeaturesFeatureEditViewTimesheetModule } from '@tempus/client/onboarding-client/shared/features/feature-edit-view-timesheet';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/resource/timesheet/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatDialogModule,
		MatTooltipModule,
		MatTableModule,
		MatSlideToggleModule,
		FlexLayoutModule,
		CommonModule,
		MatFormFieldModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedInputResourceInformationModule,
		ClientSharedPresentationalResourceDisplayModule,
		OnboardingClientSharedFeatureEditViewFormModule,
		ClientOnboardingClientSharedFeaturesFeatureEditViewTimesheetModule,
		MatNativeDateModule,
		MatDatepickerModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: TimesheetComponent,
			},
			{
				path: 'new',
				pathMatch: 'full',
				component: CreateNewTimesheetComponent,
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
	declarations: [TimesheetComponent, CreateNewTimesheetComponent],
})
export class OnboardingClientResourceFeatureTimesheetModule {}
