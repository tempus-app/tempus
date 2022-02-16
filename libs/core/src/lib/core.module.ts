import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configuration } from './configuration/configuration'
import { validationSchema } from './configuration/validation'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from '../../../../ormconfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
