import { Module } from '@nestjs/common'
import { DataLayerModule } from '@tempus/datalayer'
import { ResourceService } from './services/resource.service'

@Module({
  imports: [DataLayerModule],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class AccountModule {}
