// Import necessary Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import your component
import { ViewCostBillingReportsComponent } from './view-cost-billing-reports/view-cost-billing-reports.component';

// Define the NgModule
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '', // This module is lazy-loaded, so the path here is relative to /owner/cost-billing-reports
				component: ViewCostBillingReportsComponent,
			},
		]),
	],
	declarations: [ViewCostBillingReportsComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesCostBillingReportsModule { }
