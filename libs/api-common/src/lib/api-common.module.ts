import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [],
  exports: [TypeOrmModule],
})
export class ApiCommonModule {}
