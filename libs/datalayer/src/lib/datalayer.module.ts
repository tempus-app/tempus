import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LinkEntity,
  ResourceEntity,
  UserEntity,
  LocationEntity,
  CertificationEntity,
  EducationEntity,
  ExperienceEntity,
  RevisionEntity,
  SkillEntity,
  SkillTypeEntity,
  ViewEntity,
  ClientEntity,
  ProjectEntity,
  TaskEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinkEntity,
      ResourceEntity,
      UserEntity,
      LocationEntity,
      CertificationEntity,
      EducationEntity,
      ExperienceEntity,
      RevisionEntity,
      SkillEntity,
      SkillTypeEntity,
      ViewEntity,
      ClientEntity,
      ProjectEntity,
      TaskEntity,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DataLayerModule {}
