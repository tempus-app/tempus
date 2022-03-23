import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { PersonalInformationComponent } from './personal-information/personal-information.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatGridListModule,
		MatFormFieldModule,
		MatButtonModule,
		RouterModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
	],
	declarations: [PersonalInformationComponent],
	exports: [PersonalInformationComponent],
})
export class OnboardingClientSharedPresentationalResourceDisplayModule {}
