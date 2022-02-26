import { forwardRef, Module } from '@nestjs/common';
import { DataLayerModule } from '@tempus/datalayer';
import { AuthModule } from '@tempus/api-auth';
import { UserService } from './services/user.service';
import { ResourceService } from './services/resource.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DataLayerModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [ResourceService, UserService],
  exports: [ResourceService, UserService],
})
export class AccountModule {}
