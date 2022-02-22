import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { ConfigService } from '@nestjs/config'
import { EmailService } from '.'
import { DataLayerModule } from '@tempus/datalayer'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          port: config.get('EMAIL_PORT'),
          secure: false,
          requireTLS: true,
          auth: {
            user: config.get('EMAIL_USERNAME'),
            pass: config.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('EMAIL_ADDRESS')}>`,
        },
        template: {
          dir: __dirname + '/templates',
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
})
export class EmailModule {}
