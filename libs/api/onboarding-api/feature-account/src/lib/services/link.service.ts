import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatelinkDto } from '@tempus/api/shared/dto';
import { LinkEntity, ProjectEntity, ResourceEntity } from '@tempus/api/shared/entity';
import { EmailService } from '@tempus/api/shared/feature-email';
import { Link, StatusType } from '@tempus/shared-domain';
import { getManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinkService {
	constructor(
		@InjectRepository(LinkEntity)
		private linkRepository: Repository<LinkEntity>,
		private emailService: EmailService,
		@InjectRepository(ProjectEntity)
		private projectRepository: Repository<ProjectEntity>,
	) {}

	async createLinkAndSendEmail(fullLink: LinkEntity, sendEmail: boolean){
		return await getManager().transaction(async (manager) => {
			const createdLink = await manager.getRepository(LinkEntity).save(fullLink)
			if(sendEmail){
				try {
					await this.emailService.sendInvitationEmail(createdLink);
				} catch (err){
					throw new Error('Email unable to be sent.')
				}
			}
			return createdLink
		})
	}

	async createLink(link: LinkEntity, projectId: number, sendEmail = true): Promise<Link> {
		const uniqueToken = uuidv4();
		let expiryDate = new Date(link.expiry);
		const currentDate = new Date();

		// if custom expiry not defined, link expires in a week
		if (!link.expiry) {
			expiryDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
		} else if (currentDate >= expiryDate) {
			throw new BadRequestException('Expiry Date must be in the future');
		}
		const fullLink = { ...link, token: uniqueToken, status: StatusType.ACTIVE, expiry: expiryDate };

		// TODO: NOT GREAT FOR NOW, BUT WAS GETTING DEP ISSUES TRYING TO IMPORT PROJECT SERVICE
		const projectEntity = await this.projectRepository.findOne(projectId);
		if (!projectEntity) throw new NotFoundException(`Could not find project with id ${projectId}`);
		fullLink.project = projectEntity;
    
		//Check link email does not already exist
		const existingLink = await this.linkRepository.findOne({where: {email: link.email}})
		if(existingLink){
			throw new BadRequestException(`Link for email ${link.email} already exists`);
		}

    	const createdLink = await this.createLinkAndSendEmail(fullLink, sendEmail);
	
		return createdLink;
  }

	async findLinkById(linkId: number): Promise<Link> {
		const linkEntity = await this.linkRepository.findOne(linkId, {
			relations: ['project'],
		});
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

	async assignResourceToLink(linkId: number, resource: ResourceEntity): Promise<LinkEntity> {
		const linkEntity = await this.linkRepository.findOne(linkId);
		if (!linkEntity) {
			throw new NotFoundException(`Could not find token with id ${linkId}`);
		}
		linkEntity.user = resource;

		return this.linkRepository.save(linkEntity);
	}
}
