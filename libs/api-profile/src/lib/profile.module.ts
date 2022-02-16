import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RevisionEntity, ViewEntity, SkillEntity, EducationEntity, SkillTypeEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([ViewEntity, SkillEntity, EducationEntity, RevisionEntity, SkillTypeEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
