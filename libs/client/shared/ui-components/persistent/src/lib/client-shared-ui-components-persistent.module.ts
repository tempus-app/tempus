import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterComponent } from './footer/footer.component';
import { StepperComponent } from './stepper/stepper.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
	imports: [
		CommonModule,
		MatSlideToggleModule,
		MatIconModule,
		MatButtonModule,
		MatStepperModule,
		MatSidenavModule,
		MatButtonToggleModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsModalModule,
		ClientSharedUiComponentsInputModule,
		MatFormFieldModule,
		RouterModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
	declarations: [
		FooterComponent,
		StepperComponent,
		SidebarComponent,
		CreateProjectComponent,
		CreateProjectModalComponent,
	],
	exports: [FooterComponent, StepperComponent, SidebarComponent, CreateProjectComponent, CreateProjectModalComponent],
})
export class ClientSharedUiComponentsPersistentModule {}
