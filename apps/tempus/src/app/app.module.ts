import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'
import { HttpClientModule } from '@angular/common/http'
import { FrontendCommon } from '@tempus/frontend-common';
import { SignInComponent } from './sign-in/sign-in.component'
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, SignInComponent],
  imports: [BrowserModule, HttpClientModule, MatInputModule, MatButtonModule, FrontendCommon, MatGridListModule, MatCardModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    SignInComponent
  ],
})
export class AppModule {}
