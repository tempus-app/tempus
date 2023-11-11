import { Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ClientController } from './controllers/client.controller';
import { ClientRepresentativeController } from './controllers/clientRepresentative.controller';
import { ProjectController } from './controllers/project.controller';
import { ReportsController } from './controllers/reports.controller'; // Import ReportsController
import { ClientService, ProjectService, ClientRepresentativeService, ReportService } from './services'; // Import ReportService

@Module({
	imports: [ApiSharedEntityModule, AccountModule, CommonModule],
	controllers: [ClientController, ProjectController, ClientRepresentativeController, ReportsController], // Add ReportsController
	providers: [ClientService, ProjectService, ClientRepresentativeService, ReportService], // Add ReportService
	exports: [ClientService, ProjectService, ClientRepresentativeService, ReportService], // ReportService can be exported if needed elsewhere
})
export class ProjectModule {}
