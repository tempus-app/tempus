import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';

import { ReviewComponent } from './review/review.component';

@NgModule({
	imports: [
		FlexLayoutModule,
		MatGridListModule,
		MatFormFieldModule,
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ReviewComponent,
			},
		]),
	],
	declarations: [ReviewComponent],
	exports: [ReviewComponent],
})
export class OnboardingClientSignupFeatureReviewInfoModule {}
