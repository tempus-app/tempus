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

			cy.login(email, password);
			cy.url().should('include', 'resource');
		});

		it('should logout', () => {
			cy.get('[id=logout-button]').click();
			cy.url().should('include', 'signin');
		});
	});

  describe('revision', () => {

    const makeChangeSendForApprovalLoginAsBO = (resEmail: string, newProfileSummary: string, newInstName: string) => {
      // Update profile summary and institution name
      cy.get('#institution-input input').first().clear()
      cy.get('#institution-input input').first().type(newInstName)
      cy.get('#institution-error').should('not.exist')
      cy.get('#profile-summary').scrollIntoView().clear()
      cy.get('#profile-summary').clear()
      cy.get('#profile-summary').type(newProfileSummary)

      // Submit for approval
      cy.get('#submit-profile-button button').click()
      cy.get('tempus-info-modal tempus-button:nth-child(2)').click()

      // Verify View locked post sending for approbal
      cy.get('#error-icon').should('be.visible')
      cy.get('#edit-profile-button button').should('be.disabled')


      cy.get('[id=logout-button]').click();

      // Login as business owner
      const busOwnerAccount = getUserCredentials(RoleType.BUSINESS_OWNER);
			const busOwnerEmail = busOwnerAccount.email
      const busOwnerPassword = busOwnerAccount.password

			cy.login(busOwnerEmail, busOwnerPassword);

      cy.wait(5000);

      // Verify the error icon shows for the resource who requested approval
      const resRow = cy.contains('tr', `(${resEmail})`)
      resRow.get('mat-icon').should('be.visible');

      cy.contains('p', `(${resEmail})`).click();
      cy.wait(2000)

      cy.get('[id=revision-icon]').should('be.visible')

      // Verify correct data changed by resource shows up here
      cy.get('[id=profile-summary-text]').should('have.text', newProfileSummary)
      cy.get('[id=institution-name-text]').first().should('have.text', newInstName)
    }
    it('should create revision and approve it', () => {
      const resAccount = getUserCredentials(RoleType.AVAILABLE_RESOURCE);
			const resEmail = resAccount.email
      const resPassword = resAccount.password

			cy.login(resEmail, resPassword);

      cy.wait(5000);

      cy.get('[id=edit-profile-button]').wait(2000).click();

      cy.wait(2000);

      // Verify personal information fields are disabled
      cy.get('#first-name-input mat-form-field').should('have.class', 'mat-form-field-disabled')
      cy.get('#last-name-input mat-form-field').should('have.class', 'mat-form-field-disabled')
      cy.get('#phNum-input mat-form-field').should('have.class', 'mat-form-field-disabled')
      cy.get('#linkedin-link-input mat-form-field').should('have.class', 'mat-form-field-disabled')
      cy.get('#github-link-input mat-form-field').should('have.class', 'mat-form-field-disabled')
      cy.get('#other-link-input mat-form-field').should('have.class', 'mat-form-field-disabled')

      // Verify form is unsubmittable until valid
      cy.get('#institution-input input').first().scrollIntoView().clear()
      cy.get('#institution-error').should('be.visible')
      cy.get('#submit-profile-button button').should('be.disabled')

      makeChangeSendForApprovalLoginAsBO(resEmail, 'New profile summary', 'New institution name')

      // Approve changes
      cy.get('[id=approve-view-button]').click()
      cy.get('tempus-info-modal tempus-button').click()

      cy.wait(2000)

      // Verify the error icon does not show for the resource who requested approval
      cy.get('#table-row-icon').should('not.exist');

      cy.get('[id=logout-button]').click();
      cy.login(resEmail, resPassword);

      cy.wait(5000);

      // Verify view not locked
      cy.get('#error-icon').should('not.exist')
      cy.get('#edit-profile-button button').should('not.be.disabled')

      // Verify correct data changed by resource shows up here
      cy.get('[id=profile-summary-text]').should('have.text', 'New profile summary')
      cy.get('[id=institution-name-text]').should('have.text', 'New institution name')

    })
    it('should create revision, reject it, re revise and then approve', () => {
      const resAccount = getUserCredentials(RoleType.AVAILABLE_RESOURCE);
			const resEmail = resAccount.email
      const resPassword = resAccount.password

			cy.login(resEmail, resPassword);

      cy.wait(5000);

      cy.get('[id=edit-profile-button]').wait(2000).click();

      cy.wait(2000);

      makeChangeSendForApprovalLoginAsBO(resEmail, 'New profile summary', 'New institution name')

      // Reject changes
      cy.get('[id=reject-view-button]').scrollIntoView().click()
      cy.get('#reject-revision-message-textarea textarea').type("Rejection message")
      cy.get('tempus-content-modal tempus-button:nth-child(2)').click()

      cy.wait(2000)

      // Verify the error icon does not show for the resource who requested approval
      cy.get('#table-row-icon').should('not.exist')

      // Click into resource profile again and verify no error icons
      cy.contains('p', `(${resEmail})`).click();
      cy.wait(2000)

      cy.get('[id=revision-icon]').should('not.exist')

      // Verify changes made by resource dont show here
      cy.get('[id=profile-summary-text]').should('not.have.text', 'New profile summary')
      cy.get('[id=institution-name-text]').first().should('not.have.text', 'New institution name')

      // Login as resource
      cy.get('[id=logout-button]').click();
      cy.login(resEmail, resPassword);

      cy.wait(5000);

      // Verify View unlocked post rejection and revision icon showing
      cy.get('#reject-icon').should('be.visible')
      cy.get('#edit-profile-button button').should('not.be.disabled')
  
      // Verify rejection dialog and appropriate message shows
      cy.get('#rejection-dialog').should('be.visible')
      cy.get('#rejection-dialog p').should('have.text', "Rejection message")

      cy.get('[id=edit-profile-button]').wait(2000).click();

      cy.wait(2000);

      makeChangeSendForApprovalLoginAsBO(resEmail, 'New profile summary 2', 'New institution name 2')

      // Approve changes
      cy.get('[id=approve-view-button]').click()
      cy.get('tempus-info-modal tempus-button').click()

      cy.wait(2000)

      // Verify the error icon does not show for the resource who requested approval
      cy.get('#table-row-icon').should('not.exist');

      // Login as resource who requested approval
      cy.get('[id=logout-button]').click();
      cy.login(resEmail, resPassword);

      cy.wait(5000);

      // Verify view not locked
      cy.get('#error-icon').should('not.exist')
      cy.get('#edit-profile-button button').should('not.be.disabled')

      // Verify correct data changed by resource shows up here
      cy.get('[id=profile-summary-text]').should('have.text', 'New profile summary 2')
      cy.get('[id=institution-name-text]').should('have.text', 'New institution name 2')


    })
  })

	describe('login as business owner', () => {
		it('should login and show resource data', () => {
			const account = getUserCredentials(RoleType.BUSINESS_OWNER);
			const { email, password } = account;

			cy.login(email, password);
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
