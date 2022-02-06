import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { User, Resource } from '@tempus/account'
import { View, Education, Skill, Experience, Revision, SkillType } from '@tempus/profile'

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './db',
  entities: [User, Resource, View, Education, Skill, Experience, Revision, SkillType],
  synchronize: true,
}

export default config
