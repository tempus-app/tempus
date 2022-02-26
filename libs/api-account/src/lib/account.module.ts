import { EmailModule } from '@tempus/api-email';
import { DataLayerModule } from '@tempus/datalayer';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@tempus/api-auth';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';
import { ResourceService } from './services/resource.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DataLayerModule, EmailModule, forwardRef(() => AuthModule)],
  controllers: [UserController, LinkController],
  providers: [ResourceService, UserService, LinkService],
  exports: [ResourceService, UserService, LinkService],
})
export class AccountModule {}
