import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatTableModule } from '@angular/material/table';
import { ViewTimesheetApprovalsComponent } from './view-timesheet-approvals/view-timesheet-approvals.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/view-timesheet-approvals/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPresentationalModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ViewTimesheetApprovalsComponent,
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
		MatTableModule,
	],
	declarations: [ViewTimesheetApprovalsComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureViewTimesheetApprovalsModule {}
