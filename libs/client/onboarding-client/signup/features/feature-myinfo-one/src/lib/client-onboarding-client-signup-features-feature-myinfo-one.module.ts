import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatIconModule } from '@angular/material/icon';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MyInfoOneComponent } from './myinfoone/my-info-one.component';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
	],
	declarations: [MyInfoOneComponent],
	exports: [MyInfoOneComponent],
})
export class ClientOnboardingClientSignupFeaturesFeatureMyinfoOneModule {}
