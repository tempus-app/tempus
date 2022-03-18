import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FooterComponent } from './footer/footer.component';
import { StepperComponent } from './stepper/stepper.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
	imports: [CommonModule, MatIconModule, MatButtonModule, MatStepperModule, MatSidenavModule, MatButtonToggleModule],
	declarations: [FooterComponent, StepperComponent, SidebarComponent],
	exports: [FooterComponent, StepperComponent, SidebarComponent],
})
export class ClientSharedUiComponentsPersistentModule {}
