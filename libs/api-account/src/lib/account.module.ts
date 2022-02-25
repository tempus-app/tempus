import { EmailModule } from '@tempus/api-email'
import { DataLayerModule } from '@tempus/datalayer'
import { LinkController } from './controllers/link.controller'
import { LinkService } from './services/link.service'
import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { ResourceService } from './services/resource.service'
import { UserController } from './controllers/user.controller'
import { AuthModule } from '@tempus/api-auth'

@Module({
  imports: [DataLayerModule, EmailModule, forwardRef(() => AuthModule)],
  controllers: [UserController, LinkController],
  providers: [ResourceService, UserService, LinkService],
  exports: [ResourceService, UserService, LinkService],
})
export class AccountModule {}
