import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
	imports: [CommonModule, RouterModule.forChild([{ path: '', component: ManageUsersComponent }])],
	declarations: [ManageUsersComponent],
	exports: [ManageUsersComponent],
})
export class ClientOnboardingClientBusinessOwnerFeaturesFeatureManageUsersModule {}
