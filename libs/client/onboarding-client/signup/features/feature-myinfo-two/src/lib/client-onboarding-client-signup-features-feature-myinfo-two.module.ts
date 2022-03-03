import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MyInfoTwoComponent } from './myinfotwo/my-info-two.component';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		MatGridListModule,
	],
	declarations: [MyInfoTwoComponent],
	exports: [MyInfoTwoComponent],
})
export class ClientOnboardingClientSignupFeaturesFeatureMyinfoTwoModule {}
