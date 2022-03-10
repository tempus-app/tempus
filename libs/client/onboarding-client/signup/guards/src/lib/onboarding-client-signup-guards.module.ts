import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidLinkGuard } from './valid-link.guard';

@NgModule({
	imports: [CommonModule],
	providers: [ValidLinkGuard],
	exports: [ValidLinkGuard],
})
export class OnboardingClientSignupGuardsModule {}
