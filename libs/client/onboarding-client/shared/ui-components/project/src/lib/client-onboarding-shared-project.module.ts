import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { AssignResourceModalComponent } from './assign-resource-modal/assign-resource-modal.component';
import { AssignSupervisorModalComponent } from './assign-supervisor-modal/assign-supervisor-modal.component';

@NgModule({
	imports: [
		CommonModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsInputModule,
		MatSlideToggleModule,
		FlexLayoutModule,
		MatFormFieldModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
	declarations: [CreateProjectComponent, CreateProjectModalComponent, AssignResourceModalComponent, AssignSupervisorModalComponent],
	exports: [CreateProjectComponent, CreateProjectModalComponent, AssignResourceModalComponent, AssignSupervisorModalComponent],
})
export class ClientOnboardingSharedProjectModule {}
