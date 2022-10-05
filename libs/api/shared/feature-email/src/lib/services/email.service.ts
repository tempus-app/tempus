import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LinkEntity } from '@tempus/api/shared/entity';
import { ConfigService } from '@nestjs/config';
import { RoleType } from '@tempus/shared-domain';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService, private config: ConfigService) {}

	async sendInvitationEmail(link: LinkEntity): Promise<void> {
		const template = link.userType == RoleType.AVAILABLE_RESOURCE ? 'invitationLink' : 'invitationLinkSupervisor';
		await this.mailerService.sendMail({
			to: link.email, // list of receivers
			subject: 'Complete your Profile for CAL & Associates',
			template,
			context: {
				url: `${this.config.get('apiUrl')}signup/`,
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
