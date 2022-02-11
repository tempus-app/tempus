import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity, ProjectEntity, TaskEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, ProjectEntity, TaskEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
