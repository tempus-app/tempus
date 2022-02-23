import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { EmailService } from './services'
import { DataLayerModule } from '@tempus/datalayer'
import { ConfigModule, ConfigService } from '@nestjs/config'
const path = require('path')

@Module({
  imports: [
    DataLayerModule,
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.EMAIL_PASSWORD}>`,
        },
        template: {
          dir: path.resolve('../src/libs/api-email/src/lib/templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        inject: [ConfigService],
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
