import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPresentationalModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ProfileComponent,
			},
		]),
	],
	declarations: [ProfileComponent],
})
export class OnboardingClientProfileFeatureProfileModule {}
