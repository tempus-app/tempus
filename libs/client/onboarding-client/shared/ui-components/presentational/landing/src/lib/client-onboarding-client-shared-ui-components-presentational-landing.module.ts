import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingCtaComponent } from './landing-cta/landing-cta.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/credentials/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	exports: [LandingCtaComponent],
	declarations: [LandingCtaComponent],
})
export class ClientSharedPresentationalLandingModule {}
