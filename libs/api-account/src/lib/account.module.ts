import { EmailModule } from '@tempus/api-email';
import { DataLayerModule } from '@tempus/datalayer';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@tempus/api-auth';
import { ProfileModule } from '@tempus/api-profile';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';
import { ResourceService } from './services/resource.service';
import { UserController } from './controllers/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [DataLayerModule, forwardRef(() => ProfileModule), EmailModule, forwardRef(() => AuthModule), ConfigModule],
	controllers: [UserController, LinkController],
	providers: [ResourceService, UserService, LinkService],
	exports: [ResourceService, UserService, LinkService],
})
export class AccountModule {}
