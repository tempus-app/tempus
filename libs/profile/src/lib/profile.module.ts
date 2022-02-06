import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Revision, View, Skill, Education, SkillType } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([View, Skill, Education, Revision, SkillType])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
