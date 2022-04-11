import { CommandLineOptions } from 'command-line-args';

export interface CommandLineArgsOptions extends CommandLineOptions {
	clients: number;
	projects: number;
	businessOwners: number;
	resources: number;
	clear: boolean;
}
