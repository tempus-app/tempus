import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import commandLineArgs from 'command-line-args';
import { CommandLineArgsOptions, SeederService, SeedModule } from '../../libs/api/shared/feature-seed/src';

const seederArgsInterface: commandLineArgs.OptionDefinition[] = [
	{
		name: 'clients',
		type: Number,
		defaultValue: 3,
	},
	{
		name: 'projects',
		type: Number,
		defaultValue: 6, // 2 per client
	},
	{
		name: 'resources',
		type: Number,
		defaultValue: 10,
	},
	{
		name: 'clear',
		type: Boolean,
		defaultValue: true,
	},
];
async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(SeedModule);
	const logger = appContext.get(Logger);

	try {
		const seeder = appContext.get(SeederService);
		const options = commandLineArgs(seederArgsInterface);

		await seeder.seed(options as CommandLineArgsOptions);
	} catch (e) {
		logger.error(e);
	} finally {
		appContext.close();
	}
}
bootstrap();
