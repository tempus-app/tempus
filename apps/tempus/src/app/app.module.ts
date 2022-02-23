import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'
import { HttpClientModule } from '@angular/common/http'
import { FrontendCommon } from '@tempus/frontend-common';
import { FrontendSignUpModule } from '@tempus/frontend-sign-up';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, HttpClientModule, MatInputModule, MatButtonModule, FrontendCommon, MatGridListModule, MatCardModule, FrontendSignUpModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
