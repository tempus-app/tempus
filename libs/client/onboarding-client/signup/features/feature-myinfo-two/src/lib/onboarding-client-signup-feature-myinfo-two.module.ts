import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
import { MyInfoTwoComponent } from './myinfotwo/my-info-two.component';

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
				component: MyInfoTwoComponent,
			},
		]),
	],
	declarations: [MyInfoTwoComponent],
})
export class OnboardingClientSignupFeatureMyInfoTwoModule {}
