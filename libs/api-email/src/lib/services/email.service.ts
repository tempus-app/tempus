import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { LinkEntity } from '@tempus/datalayer'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInvitationEmail(link: LinkEntity): Promise<void> {
    await this.mailerService.sendMail({
      to: link.email, // list of receivers
      subject: 'Complete your Application for CAL & Associates',
      template: 'invitationLink',
      context: {
        code: 'cf1a3f828287',
        name: `${link.firstName} ${link.lastName}`,
      },
    })
  }
}
