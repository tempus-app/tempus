/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable class-methods-use-this */
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	BusinessOwnerState,
	getAllClientsBasic,
	getAllProjBasic,
	getAllResProjInfo,
	resetProjManagementState,
	selectClientBasicData,
	selectProjBasicData,
	selectResProjClientData,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import {
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ButtonType, Column, ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';
import { Client, Project } from '@tempus/shared-domain';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-manage-resources',
	templateUrl: './manage-resources.component.html',
	styleUrls: ['./manage-resources.component.scss'],
})
export class ManageResourcesComponent implements OnInit, OnDestroy {
	constructor(
		private modalService: ModalService,
		private businessOwnerStore: Store<BusinessOwnerState>,
		private sharedStore: Store<OnboardingClientState>,
		private router: Router,
		private fb: FormBuilder,
	) {}

	$destroyed = new Subject<void>();

	ButtonType = ButtonType;

	InputType = InputType;

	projectsBasic: Array<Project> = [];

	clientsBasic: Array<Client> = [];

	manageResourcesForm = this.fb.group({
		search: [''],
		invite: this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			emailAddress: ['', Validators.required],
			position: ['', Validators.required],
			client: ['', Validators.required],
			project: ['', Validators.required],
		}),
		assign: this.fb.group({
			resource: ['', Validators.required],
			client: ['', Validators.required],
			project: ['', Validators.required],
		}),
	});

	name = '';

	email = '';

	@ViewChild('inviteTemplate')
	inviteModal!: TemplateRef<unknown>;

	@ViewChild('assignTemplate')
	assignModal!: TemplateRef<unknown>;

	options = ['gabriel granata', 'mustafa ali', 'georges chamoun'];

	tableColumns: Array<Column> = [
		{
			columnDef: 'resource',
			header: 'Resource',
			cell: (element: Record<string, any>) => `${element['resource']}<br>${element['email']}`,
		},
		{
			columnDef: 'assignment',
			header: 'Assignment',
			cell: (element: Record<string, any>) => `${element['availability']}`,
		},
		{
			columnDef: 'project',
			header: 'Project',
			cell: (element: Record<string, any>) => `${element['project']}`,
		},
		{
			columnDef: 'client',
			header: 'Client',
			cell: (element: Record<string, any>) => `${element['client']}`,
		},
	];

	resProjClientData: ProjectManagmenetTableData[] = [
		{
			resource: 'Gabriel Granata',
			assignment: 'gabriel.granata@hotmail.com',
			project: 'Random project',
			client: 'Random client',
			icon: {
				val: 'error',
				class: 'priorityIcon',
			},
			url: 'test',
		},
		{
			resource: 'Gabriel Granata',
			assignment: 'gabriel.granata@hotmail.com',
			project: 'Random project',
			client: 'Random client',
		},
		{
			resource: 'Gabriel Granata',
			assignment: 'gabriel.granata@hotmail.com',
			project: 'Random project',
			client: 'Random client',
		},
	];

	modalServiceConfirmEvent: Subscription | undefined;

	ngOnInit(): void {
		this.modalServiceConfirmEvent = this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
		});
		this.businessOwnerStore.dispatch(getAllResProjInfo());
		this.businessOwnerStore.dispatch(getAllClientsBasic());
		this.businessOwnerStore.dispatch(getAllProjBasic());
		this.businessOwnerStore
			.select(selectResProjClientData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.resProjClientData = [];
				data.forEach(resProjClientData => {
					if (resProjClientData.projectClients.length > 0) {
						const firstProj = resProjClientData.projectClients[0].project;
						const firstClient = resProjClientData.projectClients[0].client;
						const allProj = resProjClientData.projectClients.map(projClient => projClient.project);
						const allClient = resProjClientData.projectClients.map(projClient => projClient.client);
						const moreThanOneProj = Array.from(new Set(allProj)).length > 1;
						const moreThanOneClient = Array.from(new Set(allClient)).length > 1;

						this.resProjClientData.push({
							resource: `${resProjClientData.firstName} ${resProjClientData.lastName}`,
							assignment: 'Assigned',
							project: `${firstProj}${moreThanOneProj ? '...' : ''}`,
							client: `${firstClient}${moreThanOneClient ? '...' : ''}`,
						});
					} else {
						this.resProjClientData.push({
							resource: `${resProjClientData.firstName} ${resProjClientData.lastName}`,
							assignment: 'Unassigned',
							project: '',
							client: '',
						});
					}
				});
			});
		this.businessOwnerStore
			.select(selectProjBasicData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.projectsBasic = data;
			});
		this.businessOwnerStore
			.select(selectClientBasicData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.clientsBasic = data;
			});
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.name = `${data.firstName} ${data.lastName}`;
				this.email = data.email || '';
			});
	}

	invite() {
		this.modalService.open(
			{
				title: 'Assign John Doe to Project',
				closable: true,
				confirmText: 'CONFIRM',
				modalType: ModalType.INFO,
				closeText: 'Cancel',
				template: this.inviteModal,
				subtitle: 'Testing someting 123',
			},
			CustomModalType.CONTENT,
		);
	}

	assign() {
		this.modalService.open(
			{
				title: 'Invite a Resource to Tempus',
				closable: true,
				confirmText: 'INVITE',
				modalType: ModalType.INFO,
				closeText: 'Cancel',
				template: this.assignModal,
			},
			CustomModalType.CONTENT,
		);
	}

	filter() {
		// TODO
	}

	search(searchTerm: string) {
		console.log(searchTerm);
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
		this.businessOwnerStore.dispatch(resetProjManagementState());
	}
}
