import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '@tempus/core'
import { AccountModule } from '@tempus/api-account'
import { DataLayerModule } from '@tempus/datalayer'

@Module({
  imports: [CoreModule, DataLayerModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
