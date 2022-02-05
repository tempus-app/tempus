import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configuration } from './configuration/configuration'
import { validationSchema } from './configuration/validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
