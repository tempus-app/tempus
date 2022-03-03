import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientOnboardingClientSignupFeaturesFeatureMyinfoTwoModule } from '@tempus/client/onboarding-client/signup/features/feature-myinfo-two';
import { NxWelcomeComponent } from './nx-welcome.component';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent, NxWelcomeComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		MatPaginatorModule,
		ClientOnboardingClientSignupFeaturesFeatureMyinfoTwoModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
