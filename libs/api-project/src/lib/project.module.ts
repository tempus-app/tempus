import { Module } from '@nestjs/common';
import { DataLayerModule } from '@tempus/datalayer';

@Module({
  imports: [DataLayerModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProjectModule {}
