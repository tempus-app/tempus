import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities'
import { ResourceEntity } from './entities/resource.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ResourceEntity])],
  providers: [],
  exports: [TypeOrmModule],
})
export class AccountModule {}
