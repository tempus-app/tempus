import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
import { ClientOnboardingSharedProjectModule } from '@tempus/client/onboarding-client/shared/ui-components/project';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: ManageUsersComponent }]),
		MatTableModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPersistentModule,
		ClientOnboardingSharedProjectModule,
		MatCheckboxModule,
		FormsModule,
	],
	declarations: [ManageUsersComponent],
	exports: [ManageUsersComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureManageUsersModule {}
