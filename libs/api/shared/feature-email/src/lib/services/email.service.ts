import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LinkEntity, PasswordResetEntity, UserEntity } from '@tempus/api/shared/entity';
import { ConfigService } from '@nestjs/config';
import { RoleType } from '@tempus/shared-domain';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService, private config: ConfigService) {}

	async sendInvitationEmail(link: LinkEntity): Promise<void> {
		let template = 'invitationLink';
		if (link.userType === RoleType.SUPERVISOR) {
			template = 'invitationLinkSupervisor';
		} else if (link.userType === RoleType.BUSINESS_OWNER) {
			template = 'invitationLinkBusinessOwner';
		}
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

	async sendResetEmail(passwordResetDetails: PasswordResetEntity): Promise<void> {
		const template = 'passwordReset';
		await this.mailerService.sendMail({
			to: passwordResetDetails.user.email, // list of receivers
			subject: 'Reset your password on Tempus',
			template,
			context: {
				url: `${this.config.get('apiUrl')}reset-password/`,
				code: passwordResetDetails.token,
				name: `${passwordResetDetails.user.firstName} ${passwordResetDetails.user.lastName}`,
				expiry: new Date(passwordResetDetails.expiry).toLocaleDateString(),
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

	async sendDeletedAccountEmail(user: UserEntity): Promise<void> {
		const template = 'accountDeleted';

		await this.mailerService.sendMail({
			to: user.email, // list of receivers
			subject: 'Account on Tempus Deleted',
			template,
			context: {
				name: `${user.firstName} ${user.lastName}`,
			},
		});
	}
}
