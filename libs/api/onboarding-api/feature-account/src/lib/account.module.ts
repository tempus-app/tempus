import { EmailModule } from '@tempus/api-shared/feature-email';
import { DataLayerModule } from '@tempus/shared-domain';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@tempus/onboarding-api/feature-auth';
import { ProfileModule } from '@tempus/onboarding-api/feature-profile';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';
import { ResourceService } from './services/resource.service';
import { UserController } from './controllers/user.controller';

@Module({
	imports: [DataLayerModule, forwardRef(() => ProfileModule), EmailModule, forwardRef(() => AuthModule)],
	controllers: [UserController, LinkController],
	providers: [ResourceService, UserService, LinkService],
	exports: [ResourceService, UserService, LinkService],
})
export class AccountModule {}
