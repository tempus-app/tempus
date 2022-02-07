import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { User, Resource } from '@tempus/account'
import { View, Education, Skill, Experience, Revision, SkillType } from '@tempus/profile'
import { Client, Project, Task } from '@tempus/project'

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './db',
  entities: [User, Resource, View, Education, Skill, Experience, Revision, SkillType, Client, Project, Task],
  synchronize: true,
}

export default config
