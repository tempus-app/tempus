import { Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ClientController } from './controllers/client.controller';
import { ClientRepresentativeController } from './controllers/clientRepresentative.controller';
import { ProjectController } from './controllers/project.controller';
import { ClientRepresentativeService, ClientService, ProjectService, ReportService } from './services';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, CommonModule],
	controllers: [ClientController, ProjectController, ClientRepresentativeController],
	providers: [ClientService, ProjectService, ClientRepresentativeService, ReportService],
	exports: [ClientService, ProjectService, ClientRepresentativeService, ReportService],
})
export class ProjectModule {}
