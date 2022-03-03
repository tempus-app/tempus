import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: CredentialsComponent,
			},
		]),
	],
})
export class OnboardingClientSignupFeatureCreateCredentialsModule {}
