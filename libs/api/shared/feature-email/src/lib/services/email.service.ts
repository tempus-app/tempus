import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LinkEntity } from '@tempus/shared-domain';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendInvitationEmail(link: LinkEntity): Promise<void> {
		await this.mailerService.sendMail({
			to: link.email, // list of receivers
			subject: 'Complete your Profile for CAL & Associates',
			template: 'invitationLink',
			context: {
				code: link.token,
				name: `${link.firstName} ${link.lastName}`,
				expiry: new Date(link.expiry).toLocaleDateString(),
			},
			// TODO: uncomment me when the next version of nestmailer is released
			/* attachments: [
				{
					filename: 'placeholder.png',
					path: path.resolve(`${__dirname}/assets/images/`),
					cid: 'CalLogo:imgID', // same cid value as in the html img src
				},
			], */
		});
	}
}
