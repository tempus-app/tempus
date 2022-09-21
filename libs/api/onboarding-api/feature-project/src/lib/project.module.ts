import { Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ClientController } from './controllers/client.controller';
import { ProjectController } from './controllers/project.controller';

import { ClientService, ProjectService } from './services';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, CommonModule],
	controllers: [ClientController, ProjectController],
	providers: [ClientService, ProjectService],
	exports: [ClientService, ProjectService],
})
export class ProjectModule {}
