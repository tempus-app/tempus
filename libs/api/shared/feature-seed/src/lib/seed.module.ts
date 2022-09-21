import { Logger, Module } from '@nestjs/common';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CoreModule } from '@tempus/api/shared/feature-core';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ProjectModule } from '@tempus/onboarding-api/feature-project';
import { SeederService } from './seeder';
import { ClientSeederService } from './services/client.seeder.service';
import { LinkSeederService } from './services/link.seeder.service';
import { ProjectSeederService } from './services/project.seeder.service';
import { ResourceSeederService } from './services/resource.seeder.service';
import { UserSeederService } from './services/user.seeder.service';
/**
 * Module to seed database data
 *  @module
 */
@Module({
	imports: [ApiSharedEntityModule, AccountModule, ProjectModule, CoreModule, Logger],
	providers: [
		ClientSeederService,
		ProjectSeederService,
		SeederService,
		UserSeederService,
		ResourceSeederService,
		LinkSeederService,
	],
	exports: [SeederService],
})
export class SeedModule {}
