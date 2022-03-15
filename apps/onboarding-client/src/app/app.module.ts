import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnboardingClientShellModule } from '@tempus/client/onboarding-client/shell';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

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
		OnboardingClientShellModule,
		StoreModule.forRoot(
			{},
			{
				metaReducers: !environment.production ? [] : [],
				runtimeChecks: {
					strictActionImmutability: true,
					strictStateImmutability: true,
				},
			},
		),
		EffectsModule.forRoot([]),
		!environment.production ? StoreDevtoolsModule.instrument({ name: 'Tempus Onboarding Client App' }) : [],
		StoreRouterConnectingModule.forRoot(),
		// RouterModule.forRoot([
		// 	{
		// 		path: '',
		// 		component: AppComponent,
		// 		children: [
		// 			{
		// 				path: '',
		// 				loadChildren: () =>
		// 					import('@tempus/onboarding-client/signup/shell').then(m => m.OnboardingClientSignupFeatureShellModule),
		// 			},
		// 		],
		// 	},
		// ]),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
