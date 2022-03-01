import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendCommon } from '@tempus/frontend-common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MyInfoOneComponent } from './my-info-one/my-info-one.component';
import { MyInfoTwoComponent } from './my-info-two/my-info-two.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
	imports: [
		CommonModule,
		FrontendCommon,
		MatCardModule,
		MatGridListModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
	],
	declarations: [SignInComponent, MyInfoOneComponent, MyInfoTwoComponent],
	exports: [SignInComponent, MyInfoOneComponent, MyInfoTwoComponent],
})
export class FrontendSignUpModule {}
