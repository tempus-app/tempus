import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './footer/footer.component';
import { StepperComponent } from './stepper/stepper.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AssignResourceModalComponent } from './assign-resource-modal/assign-resource-modal.component';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatStepperModule,
		MatSidenavModule,
		MatButtonToggleModule,
		FlexLayoutModule,
		MatFormFieldModule,
		ClientSharedUiComponentsInputModule,
		ClientSharedUiComponentsPresentationalModule,
		RouterModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
	declarations: [FooterComponent, StepperComponent, SidebarComponent, AssignResourceModalComponent],
	exports: [FooterComponent, StepperComponent, SidebarComponent, AssignResourceModalComponent],
})
export class ClientSharedUiComponentsPersistentModule {}
