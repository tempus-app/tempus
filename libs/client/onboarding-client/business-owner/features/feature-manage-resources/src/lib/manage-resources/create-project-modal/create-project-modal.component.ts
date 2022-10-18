import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '@tempus/client/shared/ui-components/modal';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '@tempus/shared-domain';
import { I } from '@angular/cdk/keycodes';

@Component({
	selector: 'tempus-create-project-modal',
	templateUrl: './create-project-modal.component.html',
	styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModalComponent implements OnInit {
	constructor(private translateService: TranslateService, private modalService: ModalService, private fb: FormBuilder) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	createProjectUseExisitingClientRep = true;

	createProjectUseExisitingClient = true;

	prefix = 'onboardingOwnerManageResources.modal.newProjectModal.';

	statusOptions = ['NOT_STARTED', 'IN_PROGRESS'];

	commonPrefix = 'onboardingClient.input.common.';

	InputType = InputType;

	@Input()
	clientOptions: { val: string; id: number }[] = [];

	@Input()
	clients: Client[] = [];

	@Input()
	form: FormGroup = this.fb.group({});

	currentClientReps: { val: string; id: number }[] = [];

	changeCreateClient = () => {
		this.createProjectUseExisitingClient = !this.createProjectUseExisitingClient;

		if (this.createProjectUseExisitingClient) {
			this.form.get('client')?.addValidators(Validators.required);

			// no longer required
			this.form.get('clientName')?.clearValidators();

			this.resetNewClientDetails();
		} else {
			this.form.get('client')?.clearValidators();

			// now required
			this.form.get('clientName')?.addValidators(Validators.required);

			this.resetExistingClientDetails();
		}
	};

	changeCreateClientRep = () => {
		this.createProjectUseExisitingClientRep = !this.createProjectUseExisitingClientRep;
		if (this.createProjectUseExisitingClientRep) {
			this.form.get('clientRepresentative')?.addValidators(Validators.required);

			// no longer required
			this.form.get('clientRepFirstName')?.clearValidators();
			this.form.get('clientRepLastName')?.clearValidators();
			this.form.get('clientRepEmail')?.clearValidators();

			this.resetNewClientRepDetails();
		} else {
			this.form.get('clientRepresentative')?.clearValidators();

			// now required
			this.form.get('clientRepFirstName')?.addValidators(Validators.required);
			this.form.get('clientRepLastName')?.addValidators(Validators.required);
			this.form.get('clientRepEmail')?.addValidators(Validators.required);

			this.resetExistingClientRepDetails();
		}
	};

	updateClientRepresentatives = (clientId?: string) => {
		const existingSelectedClient = this.form.get('client')?.value;
		const id = parseInt(clientId || existingSelectedClient, 10);
		this.form.get('clientRepresentative')?.reset();
		this.currentClientReps =
			this.clients
				.find(client => client.id === id)
				?.representatives.map(rep => {
					return {
						val: `${rep.firstName} ${rep.lastName} (${rep.email})`,
						id: rep.id,
					};
				}) || [];
		this.resetNewClientDetails();
	};

	resetNewClientDetails = () => {
		this.form.get('clientName')?.reset();
	};

	resetExistingClientDetails = () => {
		this.form.get('client')?.reset();
		this.updateClientRepresentatives();
	};

	resetNewClientRepDetails = () => {
		this.form.get('clientRepFirstName')?.reset();
		this.form.get('clientRepLastName')?.reset();
		this.form.get('clientRepLastEmail')?.reset();
	};

	resetExistingClientRepDetails = () => {
		this.form.get('clientRepresentatice')?.reset();
	};

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}
}
