import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { MyInfoTwoComponent } from './myinfotwo/my-info-two.component';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatGridListModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyInfoTwoComponent,
			},
		]),
	],
	declarations: [MyInfoTwoComponent],
})
export class OnboardingClientSignupFeatureMyInfoTwoModule {}
