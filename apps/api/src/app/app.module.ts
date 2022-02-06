import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '@tempus/core'
import { AccountModule } from '@tempus/account'

@Module({
  imports: [CoreModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
