import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MyInfoOneComponent } from './myinfoone/my-info-one.component';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedInputResourceInformationModule,
		FlexLayoutModule,
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
