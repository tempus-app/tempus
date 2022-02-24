import { Module } from '@nestjs/common'
import { DataLayerModule } from '@tempus/datalayer'
import { UserController } from './controllers/user.controller'
import { ResourceService } from './services/resource.service'
import { UserService } from './services/user.service'

@Module({
  imports: [DataLayerModule],
  controllers: [UserController],
  providers: [UserService, ResourceService],
  exports: [UserService, ResourceService],
})
export class AccountModule {}
