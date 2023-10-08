import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CostReportsComponent } from './cost-reports/cost-reports.component';

@NgModule({
	imports: [
		CommonModule,
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
