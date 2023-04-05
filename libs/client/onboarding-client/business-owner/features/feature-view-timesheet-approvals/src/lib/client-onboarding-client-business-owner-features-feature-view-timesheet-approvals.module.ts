import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewTimesheetApprovalsComponent } from './view-timesheet-approvals/view-timesheet-approvals.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Add this line

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/owner/view-timesheet-approvals/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPresentationalModule,
		MatPaginatorModule,
		MatDialogModule,
		MatButtonModule,
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
		MatIconModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [ViewTimesheetApprovalsComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureViewTimesheetApprovalsModule {}
