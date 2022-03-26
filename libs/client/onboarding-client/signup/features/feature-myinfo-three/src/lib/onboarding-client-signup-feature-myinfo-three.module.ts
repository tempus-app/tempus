import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
import { MyInfoThreeComponent } from './myinfothree/my-info-three.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedInputResourceInformationModule,
		MatButtonModule,
		FlexLayoutModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: MyInfoThreeComponent,
			},
		]),
	],
	declarations: [MyInfoThreeComponent],
})
export class OnboardingClientSignupFeatureMyInfoThreeModule {}
