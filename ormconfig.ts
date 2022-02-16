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
  host: process.env.DB_HOST.toString(),
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME.toString(),
  password: process.env.DB_PASSWORD.toString(),
  database: process.env.DB_NAME.toString(),
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
