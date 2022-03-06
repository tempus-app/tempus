import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MyInfoThreeComponent } from './myinfothree/my-info-three.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatIconModule,
		MatGridListModule,
		MatCardModule,
		MatChipsModule,
		MatFormFieldModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyInfoThreeComponent,
			},
		]),
	],
	declarations: [MyInfoThreeComponent],
	exports: [MyInfoThreeComponent],
})
export class OnboardingClientSignupFeatureMyInfoThreeModule {}
