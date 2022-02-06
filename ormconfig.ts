import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { User } from './apps/api/src/app/user.entity'

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './db',
  entities: [User],
  synchronize: true,
}

export default config
