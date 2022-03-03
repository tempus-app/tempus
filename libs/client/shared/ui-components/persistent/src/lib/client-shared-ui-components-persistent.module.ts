import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper/stepper-module';
import { FooterComponent } from './footer/footer.component';
import { StepperComponent } from './stepper/stepper.component';

@NgModule({
	imports: [CommonModule, MatIconModule, MatButtonModule, MatStepperModule],
	declarations: [FooterComponent, StepperComponent],
	exports: [FooterComponent, StepperComponent],
})
export class ClientSharedUiComponentsPersistentModule {}
