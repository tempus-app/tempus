import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { FrontendCommon } from '@tempus/frontend-common';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MyInfoOneComponent } from './my-info-one/my-info-one.component';

@NgModule({
  imports: [CommonModule, FrontendCommon, MatCardModule, MatGridListModule, MatIconModule, MatButtonModule],
  declarations: [
    SignInComponent,
    MyInfoOneComponent
  ],
  exports: [
    SignInComponent,
    MyInfoOneComponent
  ],
})
export class FrontendSignUpModule {}
