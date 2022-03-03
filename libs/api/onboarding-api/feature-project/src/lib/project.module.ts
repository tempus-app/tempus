import { Module } from '@nestjs/common';
import { DataLayerModule } from '@tempus/shared-domain';

@Module({
	imports: [DataLayerModule],
	controllers: [],
	providers: [],
	exports: [],
})
export class ProjectModule {}
