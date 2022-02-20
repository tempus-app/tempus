import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '@tempus/core'
import { AccountModule } from '@tempus/api-account'
import { DataLayerModule } from '@tempus/datalayer'
import { ProfileModule } from '@tempus/api-profile'

@Module({
  imports: [CoreModule, DataLayerModule, AccountModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
