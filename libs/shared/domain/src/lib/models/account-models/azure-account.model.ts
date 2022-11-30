import { User } from '@microsoft/microsoft-graph-types';

export interface AzureAccount {
	user: User;
	temporaryPassword: string;
}
