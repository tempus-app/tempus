import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { User, Resource } from '@tempus/account'
import { View, Education, Skill, Experience, Revision, SkillType } from '@tempus/profile'
import { Client, Project, Task } from '@tempus/project'

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Resource, View, Education, Skill, Experience, Revision, SkillType, Client, Project, Task],
  synchronize: true,
}

export default config
