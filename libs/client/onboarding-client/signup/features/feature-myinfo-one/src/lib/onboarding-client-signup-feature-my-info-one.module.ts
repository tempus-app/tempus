import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule, InputType } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MyInfoOneComponent } from './myinfoone/my-info-one.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatIconModule,
		MatGridListModule,
		MatCardModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyInfoOneComponent,
			},
		]),
	],
	declarations: [MyInfoOneComponent],
})
export class OnboardingClientSignupFeatureMyInfoOneModule {}
