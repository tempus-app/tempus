import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client, Project, Task } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Client, Project, Task])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
