import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { User, Resource } from '@tempus/account'

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './db',
  entities: [User, Resource],
  synchronize: true,
}

export default config
