import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
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
} from '@tempus/datalayer';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST.toString(),
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME.toString(),
  password: process.env.DB_PASSWORD.toString(),
  database: process.env.DB_NAME.toString(),
  entities: [
    UserEntity,
    ResourceEntity,
    LinkEntity,
    ViewEntity,
    EducationEntity,
    SkillEntity,
    ExperienceEntity,
    RevisionEntity,
    SkillTypeEntity,
    ClientEntity,
    ProjectEntity,
    TaskEntity,
    LocationEntity,
    CertificationEntity,
  ],
  synchronize: true,
  logging: true,
};

export default config;
