import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity, ProjectEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { LinkService } from '@tempus/onboarding-api/feature-account';
import { Link } from '@tempus/shared-domain';
import { CreateLinkDto } from '@tempus/api/shared/dto';

/**
 *
 */
@Injectable()
export class LinkSeederService {
	/**
	 * Seeds the user database with test data
	 * @param clientRepository user database repository
	 */
	constructor(
		@InjectRepository(LinkEntity)
		private linkRepository: Repository<LinkEntity>,
		private linkService: LinkService,
	) {}

	/**
	 * drops all entities in the user repository
	 */
	async clear() {
		this.linkRepository.query('DELETE from link_entity Cascade');
	}

	/**
	 * creates a specifed number of client entites
	 * @param count number of entities to create
	 * @returns array of created clients
	 */
	async seed(projects: ProjectEntity[], count = 4): Promise<Link[]> {
		const createdLinks: Link[] = [];

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const firstName = faker.name.firstName();
			const lastName = faker.name.lastName();
			console.log(projects[i % projects.length]);
			const link: CreateLinkDto = new CreateLinkDto(
				firstName,
				lastName,
				faker.internet.email(firstName, lastName),
				faker.date.soon(7),
				projects[i % projects.length].id,
			);
			const linkEntity = LinkEntity.fromDto(link);
			const createdLink = await this.linkService.createLink(linkEntity, link.projectId, false);
			createdLinks.push(createdLink);
		}
		return createdLinks;
	}
}
