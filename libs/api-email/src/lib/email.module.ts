import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { EmailService } from './services'
import { DataLayerModule } from '@tempus/datalayer'
import { ConfigService } from '@nestjs/config'
const path = require('path')

@Module({
  imports: [
    DataLayerModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('emailHost'),
          port: config.get('emailPort'),
          secure: false,
          requireTLS: true,
          auth: {
            user: config.get('emailUsername'),
            pass: config.get('emailPassword'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('emailDefaultAddress')}>`,
        },
        template: {
          dir: path.resolve('../src/libs/api-email/src/lib/templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
