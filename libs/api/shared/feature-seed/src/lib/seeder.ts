import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { CommandLineArgsOptions } from './commandLineArgs.type';
import { ClientSeederService } from './services/client.seeder.service';
import { LinkSeederService } from './services/link.seeder.service';
import { ProjectSeederService } from './services/project.seeder.service';
import { ResourceSeederService } from './services/resource.seeder.service';
import { UserSeederService } from './services/user.seeder.service';
/**
 * provider to seed database
 */
@Injectable()
export class SeederService {
	/**
	 * contructs seeder service class
	 * @param clientSeederService client seeder
	 * @param projectSeederService project seeder
	 * @param userSeederService seeds users
	 */
	constructor(
		private clientSeederService: ClientSeederService,
		private projectSeederService: ProjectSeederService,
		private userSeederService: UserSeederService,
		private resourceSeedService: ResourceSeederService,
		private linkSeederService: LinkSeederService,
	) {}

	/**
	 * drops all entities in the tempus repository
	 */
	async clear() {
		await this.linkSeederService.clear();

		await this.resourceSeedService.clear();
		await this.projectSeederService.clear();
		await this.clientSeederService.clear();
	}

	/**
	 * seeds the database with clients, projects, users, resources etc
	 * @param args command line args args to specify number
	 */
	async seed(args: CommandLineArgsOptions) {
		// eslint-disable-next-line no-plusplus
		if (args.clear) await this.clear();

		const clients = await this.clientSeederService.seed(args.clients);
		const projects = await this.projectSeederService.seedProjects(clients, args.projects);
		const users = await this.userSeederService.seedBusinessOwner(args.businessOwners);
		const links = await this.linkSeederService.seed(projects, args.resources);
		const allResources = await this.resourceSeedService.seedResources(links);
		await this.projectSeederService.seedAssignedResources(projects, allResources.splice(0, args.resources / 2));
		const allUsers = users.concat(allResources);
		await SeederService.writeToCSV(allUsers);
	}

	private static async writeToCSV(users) {
		const csvWriter = createCsvWriter({
			path: './utils/csv/database_dump.csv',
			header: [
				{ id: 'firstName', title: 'First Name' },
				{ id: 'lastName', title: 'Last Name' },
				{ id: 'email', title: 'email' },
				{ id: 'password', title: 'password' },
				{ id: 'roles', title: 'role' },
			],
		});
		await csvWriter.writeRecords(users);
	}
}
