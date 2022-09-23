import { RoleType, User } from '@tempus/shared-domain';
import userAccounts from '../../../../utils/json/user-accounts.json';

export const getGreeting = () => cy.get('h1');

export const getUserCredentials = (roleType: RoleType): User => {
	return userAccounts.find((userAcccount: { roles: string | RoleType[] }) => userAcccount.roles.includes(roleType));
};
