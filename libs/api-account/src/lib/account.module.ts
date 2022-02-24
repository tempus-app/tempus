import { Module } from '@nestjs/common'
import { ProfileModule } from '@tempus/api-profile'
import { DataLayerModule } from '@tempus/datalayer'
import { UserController } from './controllers/user.controller'
import { ResourceService } from './services/resource.service'
import { UserService } from './services/user.service'

@Module({
  imports: [DataLayerModule, ProfileModule],
  controllers: [UserController],
  providers: [UserService, ResourceService],
  exports: [UserService, ResourceService],
})
export class AccountModule {}
