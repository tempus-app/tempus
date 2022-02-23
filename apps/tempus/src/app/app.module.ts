import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'
import { HttpClientModule } from '@angular/common/http'
import { FrontendCommon } from '@tempus/frontend-common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatPaginatorModule } from '@angular/material/paginator'

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    FrontendCommon,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
