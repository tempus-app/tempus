import { Module } from '@nestjs/common'
import { DataLayerModule } from 'libs/datalayer/src'
import { UserService } from './services/user.service'
import { ResourceService } from './services/resource.service'
import { AuthModule } from '@tempus/api-auth'

@Module({
  imports: [DataLayerModule, AuthModule],
  providers: [ResourceService, UserService],
  exports: [ResourceService, UserService],
})
export class AccountModule {}
