import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { ResourceEntity, UserEntity } from '@tempus/api-account'
import {
  ViewEntity,
  EducationEntity,
  SkillEntity,
  ExperienceEntity,
  RevisionEntity,
  SkillTypeEntity,
} from '@tempus/api-profile'
import { ClientEntity, ProjectEntity, TaskEntity } from '@tempus/api-project'

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    UserEntity,
    ResourceEntity,
    ViewEntity,
    EducationEntity,
    SkillEntity,
    ExperienceEntity,
    RevisionEntity,
    SkillTypeEntity,
    ClientEntity,
    ProjectEntity,
    TaskEntity,
  ],
  synchronize: true,
}

export default config
