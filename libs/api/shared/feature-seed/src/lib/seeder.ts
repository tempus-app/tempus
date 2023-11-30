import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { writeFile } from 'fs/promises';
import { ApprovalEntity, ClientEntity, UserEntity } from '@tempus/api/shared/entity';
import { getRepository } from 'typeorm';
import * as path from 'path'; // Import path module to resolve the full path
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { CommandLineArgsOptions } from './commandLineArgs.type';
import { ClientSeederService } from './services/client.seeder.service';
import { LinkSeederService } from './services/link.seeder.service';
import { ProjectSeederService } from './services/project.seeder.service';
import { ResourceSeederService } from './services/resource.seeder.service';
import { UserSeederService } from './services/user.seeder.service';
import { TimesheetSeederService } from './services/timsheet.seeder.service';
import { ReportSeederService } from './services/report.seeder.service';
import { CreateUserDto } from '@tempus/api/shared/dto';
import { RoleType } from '@tempus/shared-domain';

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
		private timesheetSeederService: TimesheetSeederService,
		private reportSeederService: ReportSeederService,
	) {}

	/**
	 * drops all entities in the tempus repository
	 */
	async clear() {
		await this.timesheetSeederService.clear();
		await this.linkSeederService.clear();
		await this.resourceSeedService.clear();
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

		console.log('Seeding clients...');
		const clients = await this.clientSeederService.seed(args.clients);
		console.log(`Seeded ${clients.length} clients`);
		const projects = await this.projectSeederService.seedProjects(clients, args.projects);
		const users = await this.userSeederService.seedBusinessOwner(args.businessOwners);
		const supervisors = await this.userSeederService.seedSupervisor(args.supervisors);
		const links = await this.linkSeederService.seed(supervisors[0], projects, args.resources);
		const businessOwners = await this.userSeederService.seedBusinessOwner(args.businessOwners);
		// ... within the seeding logic ...
		const clientUsers = await this.userSeederService.seedClients(3);
		const reports = await this.reportSeederService.seedReports(args.reports); // ... rest of the logic ...

		const availableResources = await this.resourceSeedService.seedResources(links);
		const assignedResources = await this.projectSeederService.seedAssignedResources(
			projects,
			availableResources.splice(0, args.resources / 2),
		);
		//const timesheets = await this.timesheetSeederService.seedTimesheets(supervisors, assignedResources, projects);
		const allUsers = users.concat(availableResources).concat(assignedResources).concat(supervisors).concat(clientUsers);
		//SeederService.writeToJson(allUsers);
		await SeederService.writeToCSV(allUsers);
	}

	private static async writeToCSV(users) {
		try {
			// Resolve the full path to make sure the file is being saved where you expect
			const fullPath = path.resolve('./utils/csv/user-accounts.csv');
			console.log(`Writing CSV to: ${fullPath}`); // Log the full path

			const csvWriter = createCsvWriter({
				path: fullPath, // Use the resolved full path
				header: [
					{ id: 'firstName', title: 'First Name' },
					{ id: 'lastName', title: 'Last Name' },
					{ id: 'email', title: 'email' },
					{ id: 'password', title: 'password' },
					{ id: 'roles', title: 'role' },
				],
			});

			// Perform the write operation
			await csvWriter.writeRecords(users);
			console.log('CSV file was written successfully'); // Log success message
		} catch (error) {
			// Log any errors that occur during writing to the CSV
			console.error('Error writing CSV file:', error);
		}
	}



	/*private static writeToJson(users) {
		const json = JSON.stringify(users, ['firstName', 'lastName', 'email', 'password', 'roles']);
		writeFile('./utils/json/user-accounts.json', json, 'utf8');
	}*/
}
