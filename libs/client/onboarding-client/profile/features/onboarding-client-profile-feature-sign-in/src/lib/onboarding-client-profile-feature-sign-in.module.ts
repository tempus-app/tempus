import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { SignInComponent } from './signin/sign-in.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatIconModule,
		MatButtonModule,
		MatGridListModule,
		MatCardModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: SignInComponent,
			},
		]),
	],
	declarations: [SignInComponent],
	exports: [SignInComponent],
})
export class OnboardingClientSignupFeatureSignInModule {}
