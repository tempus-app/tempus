import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadResumeComponent } from './uploadresume/uploadresume.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: UploadResumeComponent,
			},
		]),
	],
})
export class OnboardingClientSignupFeatureUploadResumeModule {}
