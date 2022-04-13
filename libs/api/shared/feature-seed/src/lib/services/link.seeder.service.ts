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
	 * Seeds the link database with test data
	 * @param linkRepository link table repository
	 */
	constructor(
		@InjectRepository(LinkEntity)
		private linkRepository: Repository<LinkEntity>,
		private linkService: LinkService,
	) {}

	/**
	 * drops all entities in the link repository
	 */
	async clear() {
		await this.linkRepository.query('DELETE from link_entity Cascade');
	}

	/**
	 * creates a specifed number of link entites
	 * @param projects projects to associate with new link
	 * @param count number of entities to create
	 * @returns array of created clients
	 */
	async seed(projects: ProjectEntity[], count = 10): Promise<Link[]> {
		const createdLinks: Link[] = [];

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const firstName = faker.name.firstName();
			const lastName = faker.name.lastName();
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
