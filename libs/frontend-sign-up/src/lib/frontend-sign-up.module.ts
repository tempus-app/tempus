import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendCommon } from '@tempus/frontend-common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  imports: [
    CommonModule,
    FrontendCommon,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [SignInComponent],
  exports: [SignInComponent],
})
export class FrontendSignUpModule {}
