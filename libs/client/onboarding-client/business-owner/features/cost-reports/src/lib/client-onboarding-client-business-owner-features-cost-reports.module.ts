import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientOnboardingSharedProjectModule } from '@tempus/client/onboarding-client/shared/ui-components/project';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CostReportsComponent } from './cost-reports/cost-reports.component';

@NgModule({
	imports: [
		CommonModule,
		MatTableModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientOnboardingSharedProjectModule,
		ClientSharedUiComponentsPersistentModule,
		ClientSharedUiComponentsInputModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		RouterModule.forChild([
			{
				path: '', // This module is lazy-loaded, so the path here is relative to /owner/cost-billing-reports
				component: CostReportsComponent,
			},
		]),
	],
	declarations: [CostReportsComponent],
	exports: [CostReportsComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesCostReportsModule {}
