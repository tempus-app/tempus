import { Module } from '@nestjs/common'
import { EmailModule } from '@tempus/api-email'
import { DataLayerModule } from 'libs/datalayer/src'
import { LinkController } from './controllers/link.controller'
import { LinkService } from './services/link.service'
import { ResourceService } from './services/resource.service'

@Module({
  imports: [DataLayerModule, EmailModule],
  controllers: [LinkController],
  providers: [ResourceService, LinkService],
  exports: [ResourceService, LinkService],
})
export class AccountModule {}
