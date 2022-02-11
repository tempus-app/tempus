import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'
import { Resource } from './entities/resource.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Resource])],
  providers: [],
  exports: [TypeOrmModule],
})
export class AccountModule {}
