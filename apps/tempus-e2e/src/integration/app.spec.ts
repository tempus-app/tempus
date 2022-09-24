import { RoleType } from '@tempus/shared-domain';
import { getUserCredentials } from '../support/app.po';
import testData from '../fixtures/mock.json';

describe('tempus e2e tests', () => {
	beforeEach(() => {
		cy.visit('/');
		// TODO: Investigate how to run seeding within cypress
	});

	describe('login and logout', () => {
		it('should login', () => {
			const account = getUserCredentials(RoleType.ASSIGNED_RESOURCE);
			const { email, password } = account;

			cy.get('input[id=username]').type(email);
			cy.get('input[id=password]').type(`${password}{enter}`);
			cy.get('.mat-button-wrapper').click();
			cy.url().should('include', 'resource');
		});

		it('should logout', () => {
			cy.get('[id=logout-button]').click();
			cy.url().should('include', 'signin');
		});
	});

	describe('login as business owner', () => {
		it('should login and show resource data', () => {
			const account = getUserCredentials(RoleType.BUSINESS_OWNER);
			const { email, password } = account;

			cy.get('input[id=username]').type(email);
			cy.get('input[id=password]').type(`${password}{enter}`);
			cy.get('.mat-button-wrapper').click();
			cy.get('.demarginizedCell').first().click();
			cy.url().should('include', 'view-resource');
		});

		it('should invite user', () => {
			cy.get('[id=invite-button]').click();
			cy.get('input[id=first-name-invite]').type(testData.mockString);
			cy.get('input[id=last-name-invite]').type(testData.mockString);
			cy.get('input[id=email-address-invite]').type(testData.email);
			cy.get('input[id=position-invite]').type(testData.mockString);
			cy.get('[id=client-invite]').click().get('[id=dropdown-option]').first().click();
			cy.get('[id=project-invite]').click().get('[id=dropdown-option]').first().click();
			cy.get('tempus-button[color=accent]').click();
			cy.url().should('include', 'manage-resources');
		});
	});
});
