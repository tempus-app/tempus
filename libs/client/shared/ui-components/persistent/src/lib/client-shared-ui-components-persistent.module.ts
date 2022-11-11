import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterComponent } from './footer/footer.component';
import { StepperComponent } from './stepper/stepper.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
	imports: [
		CommonModule,
		MatSlideToggleModule,
		MatIconModule,
		MatButtonModule,
		MatStepperModule,
		MatSidenavModule,
		MatButtonToggleModule,
		MatFormFieldModule,
		RouterModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
	],
	declarations: [FooterComponent, StepperComponent, SidebarComponent],
	exports: [FooterComponent, StepperComponent, SidebarComponent],
})
export class ClientSharedUiComponentsPersistentModule {}
