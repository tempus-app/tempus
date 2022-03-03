import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnboardingClientSignupFeatureMyInfoTwoModule } from '@tempus/onboarding-client/signup/feature-myinfo-two';
import { RouterModule } from '@angular/router';
import { OnboardingClientSignupFeatureShellModule } from '@tempus/onboarding-client/signup/shell';
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
		BrowserAnimationsModule,
		RouterModule.forRoot([
			{
				path: '',
				component: AppComponent,
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@tempus/onboarding-client/signup/shell').then(m => m.OnboardingClientSignupFeatureShellModule),
					},
				],
			},
		]),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
