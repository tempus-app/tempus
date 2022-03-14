import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from '@tempus/api/shared/entity';
import { EmailService } from '@tempus/api/shared/feature-email';
import { Link, StatusType, UpdatelinkDto } from '@tempus/shared-domain';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinkService {
	constructor(
		@InjectRepository(LinkEntity)
		private linkRepository: Repository<LinkEntity>,
		private emailService: EmailService,
	) {}

	async createLink(link: LinkEntity): Promise<Link> {
		const uniqueToken = uuidv4();
		let expiryDate = link.expiry;

		// if custom expiry not defined, link expires in a week
		if (!link.expiry) {
			const currentDate = new Date();
			expiryDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
		}
		const fullLink = { ...link, token: uniqueToken, status: StatusType.ACTIVE, expiry: expiryDate };
		await this.emailService.sendInvitationEmail(fullLink);
		return this.linkRepository.save(fullLink);
	}

	// associateLinkToUser(linkId: number, userId: number): Promise<Link> {
	// 	throw new NotImplementedException();
	// }

	async findLinkById(linkId: number): Promise<Link> {
		const linkEntity = await this.linkRepository.findOne(linkId);
		if (!linkEntity) {
			throw new NotFoundException(`Could not find token with id ${linkId}`);
		}
		if (LinkService.isLinkExpired(linkEntity)) {
			return this.editLinkStatus(linkId, StatusType.INACTIVE, linkEntity);
		}
		return linkEntity;
	}

	async findLinkByToken(token: string): Promise<Link> {
		// should be unique
		const links = await this.linkRepository.find({ where: { token } });
		const linkEntity = links[0];
		if (!linkEntity) {
			throw new NotFoundException(`Could not find link with token ${token}`);
		}
		if (LinkService.isLinkExpired(linkEntity)) {
			return this.editLinkStatus(linkEntity.id, StatusType.INACTIVE, linkEntity);
		}
		return linkEntity;
	}

	async editLink(updatelinkDto: UpdatelinkDto): Promise<Link> {
		return this.editLinkStatus(updatelinkDto.id, updatelinkDto.status);
	}

	async editLinkStatus(linkId: number, newStatus: StatusType, linkEntity?: LinkEntity): Promise<Link> {
		let existingLinkEntity = linkEntity;
		if (!existingLinkEntity) {
			existingLinkEntity = await this.linkRepository.findOne(linkId);
		}
		// recheck
		if (!existingLinkEntity) {
			throw new NotFoundException(`Could not find link with id ${linkId}`);
		}

		existingLinkEntity.status = newStatus;
		return this.linkRepository.save(existingLinkEntity);
	}

	// compares link expiry with current time
	public static isLinkExpired(linkEntity: LinkEntity): boolean {
		if (linkEntity.expiry.getTime() <= Date.now()) {
			return true;
		}
		return false;
	}
}
