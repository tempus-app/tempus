import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '@tempus/core'
import { User } from './user.entity'

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([User])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
