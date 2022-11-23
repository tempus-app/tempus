/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmailModule } from '@tempus/api/shared/feature-email';
import { forwardRef, Module } from '@nestjs/common';
import { ProfileModule } from '@tempus/onboarding-api/feature-profile';
import { ConfigModule } from '@nestjs/config';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { AuthModule } from '@tempus/api/shared/feature-auth';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';
import { ResourceService } from './services/resource.service';
import { UserController } from './controllers/user.controller';
import { GraphService } from './services/graph.service';

@Module({
	imports: [
		ApiSharedEntityModule,
		forwardRef(() => ProfileModule),
		EmailModule,
		ConfigModule,
		forwardRef(() => AuthModule),
		CommonModule,
	],
	controllers: [UserController, LinkController],
	providers: [ResourceService, UserService, LinkService, GraphService],
	exports: [ResourceService, UserService, LinkService, GraphService],
})
export class AccountModule {}
