/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable class-methods-use-this */
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	createClient,
	createLink,
	createProject,
	createResourceProjectAssignment,
	getAllClients,
	getAllResProjInfo,
	resetAsyncStatusState,
	resetProjManagementState,
	selectAsyncStatus,
	selectClientData,
	selectCreatedClientData,
	selectProjectAssigned,
	selectResProjClientData,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import {
	AsyncRequestState,
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ButtonType, Column, ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';
import { Client, ErorType, ICreateLinkDto, RoleType } from '@tempus/shared-domain';
import { distinctUntilChanged, finalize, skip, Subject, Subscription, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { I } from '@angular/cdk/keycodes';

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
		private fb: FormBuilder,
		private translateService: TranslateService,
		private router: Router,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.assigned = data['assigned'];
				this.unassigned = data['unassigned'];
				this.tableColumns = [
					{
						columnDef: 'resource',
						header: data['resource'],
						cell: (element: Record<string, any>) =>
							`<div class="demarginizedCell">${element['resource']}<p id="resource" class="mat-caption">(${element['email']})</p></div>`,
					},
					{
						columnDef: 'assignment',
						header: data['assignment'],
						cell: (element: Record<string, any>) => `${element['assignment']}`,
					},
					{
						columnDef: 'project',
						header: data['project'],
						cell: (element: Record<string, any>) => `${element['project']}`,
					},
					{
						columnDef: 'client',
						header: data['client'],
						cell: (element: Record<string, any>) => `${element['client']}`,
					},
				];
			});
		this.translateService
			.get(`${this.prefix}main.approvalTooltip`)
			.pipe(take(1))
			.subscribe(data => {
				this.awaitingApproval = data;
			});
	}

	prefix = 'onboardingOwnerManageResources.';

	roleType = RoleType;

	$destroyed = new Subject<void>();

	$inviteModalClosedEvent = new Subject<void>();

	$assignModalClosedEvent = new Subject<void>();

	$createProjectModalClosedEvent = new Subject<void>();

	ButtonType = ButtonType;

	InputType = InputType;

	loading = false;

	projectModalOpen = false;

	currentProjects: { val: string; id: number }[] = [];

	currentClientReps: { val: string; id: number }[] = [];

	clientOptions: { val: string; id: number }[] = [];

	resourceOptions: { val: string; id: number }[] = [];

	clients: Array<Client> = [];

	resProjClientTableData: ProjectManagmenetTableData[] = [];

	resProjClientTableDataFiltered: ProjectManagmenetTableData[] = [];

	name = '';

	email = '';

	assigned = '';

	unassigned = '';

	awaitingApproval = '';

	@ViewChild('inviteTemplate')
	inviteModal!: TemplateRef<unknown>;

	@ViewChild('assignTemplate')
	assignModal!: TemplateRef<unknown>;

	@ViewChild('newProjectTemplate')
	newProjectModal!: TemplateRef<unknown>;

	tableColumns: Array<Column> = [];

	modalServiceConfirmEvent: Subscription | undefined;

	createProjectUseExisitingClient = true;

	// For use in the search box
	allSearchTerms: string[] = [];

	roleTypeEnumToString = (roleType: RoleType): string => {
		if (roleType === RoleType.AVAILABLE_RESOURCE) {
			return 'Resource';
		}
		if (roleType === RoleType.SUPERVISOR) {
			return 'Supervisor';
		}
		return '';
	};

	roleTypeStringToEnum = (roleType: string): RoleType => {
		if (roleType === 'Resource') {
			return RoleType.AVAILABLE_RESOURCE;
		}
		if (roleType === 'Supervisor') {
			return RoleType.SUPERVISOR;
		}
		return RoleType.USER;
	};

	inviteTypeOptions: string[] = [
		this.roleTypeEnumToString(RoleType.AVAILABLE_RESOURCE),
		this.roleTypeEnumToString(RoleType.SUPERVISOR),
	];

	manageResourcesForm = this.fb.group({
		search: [''],
		invite: this.fb.group({
			inviteType: [this.roleTypeEnumToString(RoleType.AVAILABLE_RESOURCE), Validators.required],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			emailAddress: ['', [Validators.required, Validators.email]],
			position: [
				'',
				this.requiredIfValidator(
					() =>
						this.manageResourcesForm.get('invite')?.get('inviteType')?.value ===
						this.roleTypeEnumToString(RoleType.AVAILABLE_RESOURCE),
				),
			],
			client: [
				'',
				this.requiredIfValidator(
					() =>
						this.manageResourcesForm.get('invite')?.get('inviteType')?.value ===
						this.roleTypeEnumToString(RoleType.AVAILABLE_RESOURCE),
				),
			],
			project: [
				'',
				this.requiredIfValidator(
					() =>
						this.manageResourcesForm.get('invite')?.get('inviteType')?.value ===
						this.roleTypeEnumToString(RoleType.AVAILABLE_RESOURCE),
				),
			],
		}),
		assign: this.fb.group({
			resource: ['', Validators.required],
			client: ['', Validators.required],
			project: ['', Validators.required],
		}),
		createProject: this.fb.group({
			client: ['', Validators.required],
			clientName: [''],
			clientRepresentative: [''],
			clientRepFirstName: ['', Validators.required],
			clientRepLastName: ['', Validators.required],
			clientRepEmail: ['', [Validators.email, Validators.required]],
			startDate: ['', Validators.required],
			status: ['', Validators.required],
			name: ['', Validators.required],
		}),
	});

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			console.log(modalId);
			if (modalId === 'inviteModal') {
				this.$inviteModalClosedEvent.next();
			} else if (modalId === 'assignModal') {
				console.log('hi');

				this.$assignModalClosedEvent.next();
			} else if (modalId === 'newProjectModal') {
				console.log('hi');
				this.$createProjectModalClosedEvent.next();
			} else if (modalId === 'error') {
				this.businessOwnerStore.dispatch(resetAsyncStatusState());
			}
		});
		this.businessOwnerStore
			.select(selectAsyncStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(asyncStatus => {
				this.loading = asyncStatus.status === AsyncRequestState.LOADING;
				if (
					asyncStatus.status === AsyncRequestState.ERROR &&
					asyncStatus.error &&
					asyncStatus.error.name !== ErorType.INTERCEPTOR
				) {
					this.openErrorModal(asyncStatus.error.message);
				}
			});
		this.businessOwnerStore.dispatch(getAllResProjInfo());
		this.businessOwnerStore.dispatch(getAllClients());
		this.businessOwnerStore
			.select(selectResProjClientData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				// Getting all resources
				this.resourceOptions = data.map(resProjClient => {
					return {
						val: `${resProjClient.firstName} ${resProjClient.lastName} (${resProjClient.email})`,
						id: resProjClient.id,
					};
				});

				// Getting all Searchable terms (i.e res name, client, project)
				const allStrings: string[] = [];
				data.forEach(item => {
					allStrings.push(`${item.firstName} ${item.lastName}`);
					item.projectClients.forEach(projClient => {
						allStrings.push(projClient.client);
						allStrings.push(projClient.project.val);
					});
				});
				this.allSearchTerms = Array.from(new Set(allStrings));

				this.resProjClientTableData = [];
				data.forEach(resProjClientData => {
					const tableItem: ProjectManagmenetTableData = {
						resource: `${resProjClientData.firstName} ${resProjClientData.lastName}`,
						resourceId: resProjClientData.id,
						assignment: this.unassigned,
						email: `${resProjClientData.email}`,
						url: `../view-resources/${resProjClientData.id}`,
						project: '-',
						client: '-',
						allProjects: [],
						allClients: [],
						columnsWithIcon: ['resource'],
						columnsWithUrl: ['resource'],
					};
					if (resProjClientData.reviewNeeded) {
						tableItem.icon = { val: 'error', class: 'priorityIcon', tooltip: 'Awaiting approval' };
					}

					// Resource with atleast one project
					if (resProjClientData.projectClients.length > 0) {
						const firstProj = resProjClientData.projectClients[0].project;
						const firstClient = resProjClientData.projectClients[0].client;
						const allProj = resProjClientData.projectClients.map(projClient => projClient.project);
						const allClient = resProjClientData.projectClients.map(projClient => projClient.client);
						const moreThanOneProj = Array.from(new Set(allProj)).length > 1;
						const moreThanOneClient = Array.from(new Set(allClient)).length > 1;

						tableItem.project = `${firstProj.val}${moreThanOneProj ? '...' : ''}`;
						tableItem.client = `${firstClient}${moreThanOneClient ? '...' : ''}`;
						tableItem.assignment = this.assigned;
						tableItem.allClients = allClient;
						tableItem.allProjects = allProj;
					}
					this.resProjClientTableData.push(tableItem);
				});
				this.resProjClientTableDataFiltered = this.resProjClientTableData;
			});
		this.businessOwnerStore
			.select(selectClientData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.clients = data;
				this.clientOptions = data.map(client => {
					return {
						val: client.clientName,
						id: client.id,
					};
				});
			});
		this.businessOwnerStore
			.select(selectProjectAssigned)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(assigned => {
				if (assigned) {
					this.businessOwnerStore.dispatch(getAllResProjInfo());
				}
			});
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.name = `${data.firstName} ${data.lastName}`;
				this.email = data.email || '';
			});
	}

	openErrorModal = (errorMessage: string) => {
		this.modalService.open(
			{
				title: 'Error',
				confirmText: 'Okay',
				message: errorMessage,
				modalType: ModalType.ERROR,
				closable: false,
				id: 'error',
			},
			CustomModalType.INFO,
		);
	};

	get inviteType() {
		return this.manageResourcesForm.get('invite')?.get('inviteType')?.value;
	}

	// Projects should be those that are under the client and not already assigned to the resource
	updateProjects = (clientId?: string) => {
		const existingSelectedClient = this.manageResourcesForm.get('assign')?.get('client')?.value;
		const id = parseInt(clientId || existingSelectedClient, 10);
		this.manageResourcesForm.get('assign')?.get('project')?.reset();
		this.manageResourcesForm.get('invite')?.get('project')?.reset();

		this.currentProjects =
			this.clients
				.find(client => client.id === id)
				?.projects.map(proj => {
					return {
						val: proj.name,
						id: proj.id,
					};
				}) || [];
		this.filterCurrentProjectsBySelectedResource();
	};

	// Shouldnt see a projectif the currently selected resource is already assigned to it
	filterCurrentProjectsBySelectedResource() {
		const curSelectedRes = this.manageResourcesForm.get('assign')?.get('resource')?.value;
		this.currentProjects = this.currentProjects.filter(curFilteredProj => {
			if (curSelectedRes) {
				const curResProjClientTableDatum = this.resProjClientTableData.find(
					resProjClient => resProjClient.resourceId === curSelectedRes,
				);
				if (curResProjClientTableDatum && curResProjClientTableDatum?.allProjects.length > 0) {
					return !curResProjClientTableDatum?.allProjects.some(proj => proj.id === curFilteredProj.id);
				}
				return true;
			}
			return true;
		});
	}

	createProjectModal() {
		this.translateService
			.get(`${this.prefix}modal.newProjectModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data.title,
						id: 'newProjectModal',
						closable: true,
						confirmText: data.confirmText,
						modalType: ModalType.INFO,
						closeText: data.closeText,
						template: this.newProjectModal,
					},
					CustomModalType.CONTENT,
				);
			});

		this.manageResourcesForm
			.get('createProject')
			?.valueChanges.pipe(
				takeUntil(this.$createProjectModalClosedEvent),
				finalize(() => {
					const createProjectForm = this.manageResourcesForm.get('createProject');
					const clientName = createProjectForm?.get('clientName')?.value;
					const projectData = {
						name: createProjectForm?.get('name')?.value,
						startDate: createProjectForm?.get('startDate')?.value,
						clientRepresentativeFirstName: createProjectForm?.get('clientRepFirstName')?.value,
						clientRepresentativeLastName: createProjectForm?.get('clientRepLastName')?.value,
						clientRepresentativeEmail: createProjectForm?.get('clientRepEmail')?.value,
						clientRepresentativeId: createProjectForm?.get('clientRepresentative')?.value,
					};
					if (clientName) {
						const createClientDto = {
							clientName,
						};
						this.businessOwnerStore.dispatch(
							createClient({
								createClientDto,
							}),
						);

						this.businessOwnerStore
							.select(selectCreatedClientData)
							.pipe(takeUntil(this.$destroyed))
							.subscribe(data => {
								if (data) {
									const createProjectDto = { ...projectData, clientId: data?.id };
									this.businessOwnerStore.dispatch(createProject({ createProjectDto }));
								}
							});
					} else {
						const createProjectDto = { ...projectData, clientId: createProjectForm?.get('client')?.value };
						this.businessOwnerStore.dispatch(createProject({ createProjectDto }));
					}
				}),
			)
			.subscribe(() => {
				if (this.manageResourcesForm.get('createProject')?.valid) {
					console.log(this.manageResourcesForm.get('createProject')?.value);
					this.modalService.confirmDisabled()?.next(false);
				} else {
					this.modalService.confirmDisabled()?.next(true);
				}
			});
	}

	invite() {
		this.translateService
			.get(`${this.prefix}modal.inviteModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data['title'],
						id: 'inviteModal',
						closable: true,
						confirmText: data['confirmText'],
						modalType: ModalType.INFO,
						closeText: data['closeText'],
						template: this.inviteModal,
						subtitle: data['subtitle'],
					},
					CustomModalType.CONTENT,
				);
			});
		this.modalService.confirmDisabled()?.next(true);
		this.manageResourcesForm
			.get('invite')
			?.get('inviteType')
			?.valueChanges.pipe(distinctUntilChanged())
			.subscribe(() => {
				this.manageResourcesForm.get('invite')?.get('project')?.reset();
				this.manageResourcesForm.get('invite')?.get('position')?.reset();
				this.manageResourcesForm.get('invite')?.get('client')?.reset();
			});

		this.manageResourcesForm
			.get('invite')
			?.valueChanges.pipe(
				takeUntil(this.$inviteModalClosedEvent),
				finalize(() => {
					const createLinkDto = {
						firstName: this.manageResourcesForm.get('invite')?.get('firstName')?.value,
						lastName: this.manageResourcesForm.get('invite')?.get('lastName')?.value,
						email: this.manageResourcesForm.get('invite')?.get('emailAddress')?.value,
					} as ICreateLinkDto;

					const inviteType = this.roleTypeStringToEnum(this.inviteType);

					if (inviteType === RoleType.AVAILABLE_RESOURCE) {
						(createLinkDto.projectId = this.manageResourcesForm.get('invite')?.get('project')?.value),
							(createLinkDto.userType = RoleType.AVAILABLE_RESOURCE);
					} else {
						createLinkDto.userType = RoleType.SUPERVISOR;
					}
					this.businessOwnerStore.dispatch(
						createLink({
							createLinkDto,
						}),
					);
				}),
			)
			.subscribe(() => {
				if (this.manageResourcesForm.get('invite')?.valid) {
					this.modalService.confirmDisabled()?.next(false);
				} else {
					this.modalService.confirmDisabled()?.next(true);
				}
			});
		this.modalService
			.closed()
			.pipe(take(1))
			.subscribe(() => {
				this.resetModalData();
			});
	}

	requiredIfValidator(predicate: Function) {
		return (formControl: FormControl) => {
			if (!formControl.parent) {
				return null;
			}
			if (predicate()) {
				return Validators.required(formControl);
			}
			return null;
		};
	}

	assign() {
		this.translateService
			.get(`${this.prefix}modal.assignModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data['title'],
						id: 'assignModal',
						closable: true,
						confirmText: data['confirmText'],
						modalType: ModalType.INFO,
						closeText: data['closeText'],
						template: this.assignModal,
					},
					CustomModalType.CONTENT,
				);
			});
		this.modalService.confirmDisabled()?.next(true);
		this.manageResourcesForm
			.get('assign')
			?.valueChanges.pipe(
				takeUntil(this.$assignModalClosedEvent),
				finalize(() => {
					this.businessOwnerStore.dispatch(
						createResourceProjectAssignment({
							resourceId: this.manageResourcesForm.get('assign')?.get('resource')?.value,
							projectId: this.manageResourcesForm.get('assign')?.get('project')?.value,
						}),
					);
				}),
			)
			.subscribe(() => {
				if (this.manageResourcesForm.get('assign')?.valid) {
					this.modalService.confirmDisabled()?.next(false);
				} else {
					this.modalService.confirmDisabled()?.next(true);
				}
			});
		this.modalService
			.closed()
			.pipe(take(1))
			.subscribe(() => {
				this.resetModalData();
			});
	}

	resetModalData = () => {
		this.currentProjects = [];
		this.currentClientReps = [];
		this.manageResourcesForm.get('invite')?.reset();
		this.manageResourcesForm.get('assign')?.reset();
		this.manageResourcesForm.get('createProject')?.reset();
	};

	filter() {
		// TODO
	}

	search(searchTerm: string) {
		if (searchTerm === '') {
			this.resProjClientTableDataFiltered = this.resProjClientTableData;
			return;
		}

		this.resProjClientTableDataFiltered = this.resProjClientTableData.filter(resProjClientTableDatum => {
			if (resProjClientTableDatum.resource === searchTerm) {
				return true;
			}
			if (resProjClientTableDatum.allClients.includes(searchTerm)) {
				return true;
			}
			if (resProjClientTableDatum.allProjects.map(proj => proj.val).includes(searchTerm)) {
				return true;
			}
			return false;
		});
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
		this.businessOwnerStore.dispatch(resetProjManagementState());
	}
}
