import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '@tempus/core'
import { AccountModule } from '@tempus/api-account'
import { DataLayerModule } from '@tempus/datalayer'
import { ProfileModule } from '@tempus/api-profile'
import { EmailModule } from '@tempus/api-email'
import { PdfgeneratorModule } from '@tempus/pdfgenerator'

@Module({
  imports: [CoreModule, DataLayerModule, AccountModule, ProfileModule, EmailModule, PdfgeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
