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
	getAllResourceInfoBasic,
	getAllResProjInfo,
	getAllSearchableTerms,
	resetAsyncStatusState,
	resetCreatedClientState,
	resetCreatedProjectState,
	resetProjManagementState,
	selectAsyncStatus,
	selectClientData,
	selectCreatedClientData,
	selectCreatedProjectData,
	selectProjectAssigned,
	selectResourceBasicData,
	selectResProjClientData,
	selectSearchableTerms,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import {
	AsyncRequestState,
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ButtonType, Column, ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';
import { Client, ErorType, IAssignProjectDto, ICreateLinkDto, RoleType } from '@tempus/shared-domain';
import { distinctUntilChanged, finalize, Subject, Subscription, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

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

	commonPrefix = 'onboardingClient.input.common.';

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

	totalNumResProjClientOptions = 0;

	resProjClientTableDataFiltered: ProjectManagmenetTableData[] = [];

	tablePagination: { page: number; pageSize: number; filter: string } = {
		page: 0,
		pageSize: 5,
		filter: '',
	};

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
			startDate: ['', Validators.required],
			title: ['', Validators.required],
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
			projectManager: ['', Validators.required],
		}),
	});

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'inviteModal') {
				this.$inviteModalClosedEvent.next();
			} else if (modalId === 'assignModal') {
				this.$assignModalClosedEvent.next();
			} else if (modalId === 'newProjectModal') {
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

		this.businessOwnerStore.dispatch(getAllResProjInfo(this.tablePagination));
		this.businessOwnerStore.dispatch(getAllClients());
		this.businessOwnerStore.dispatch(getAllResourceInfoBasic());
		this.businessOwnerStore.dispatch(getAllSearchableTerms());

		// Getting all resources (basic info i.e firstname, lastname, email, id)
		this.businessOwnerStore
			.select(selectResourceBasicData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.resourceOptions = data.map(res => {
					return {
						val: `${res.firstName} ${res.lastName} (${res.email})`,
						id: res.id,
					};
				});
			});

		// Getting all Searchable terms (i.e res name, client, project)
		this.businessOwnerStore
			.select(selectSearchableTerms)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.allSearchTerms = data;
			});

		// Getting all client information
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

		// Getting if a project has recently been assigned to refresh all information
		this.businessOwnerStore
			.select(selectProjectAssigned)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(assigned => {
				if (assigned) {
					this.businessOwnerStore.dispatch(getAllResProjInfo(this.tablePagination));
				}
			});

		// Get logged in users username and email
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.name = `${data.firstName} ${data.lastName}`;
				this.email = data.email || '';
			});

		// Getting the most recent created project data to then refresh all client info
		this.businessOwnerStore
			.select(selectCreatedProjectData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				if (data) {
					// after a project is created we want updated client info
					this.businessOwnerStore.dispatch(getAllClients());
				}
			});

		// Get table relevant data and manipulate to extract rows of information
		this.businessOwnerStore
			.select(selectResProjClientData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				debugger;
				this.totalNumResProjClientOptions = data.totalItems;
				this.resProjClientTableData = [];
				data.projResClientData.forEach(resProjClientData => {
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
						columnsWithChips: [],
					};
					if (resProjClientData.reviewNeeded) {
						tableItem.icon = { val: 'error', class: 'priorityIcon', tooltip: 'Awaiting approval' };
					}

					// Resource with atleast one project
					if (resProjClientData.projectClients.length > 0) {
						let firstProj = resProjClientData.projectClients[0].projects[0].val;
						let firstClient = resProjClientData.projectClients[0].client;
						const allProj: { val: string; id: number }[] = [];

						resProjClientData.projectClients.forEach(projClientData => {
							const allProjUnderClient = projClientData.projects.map(proj => ({ val: proj.val, id: proj.id }));
							allProjUnderClient.forEach(proj => {
								allProj.push(proj);
							});
						});
						const allClient = resProjClientData.projectClients.map(projClient => projClient.client);
						const moreThanOneProj = Array.from(new Set(allProj)).length > 1;
						const moreThanOneClient = Array.from(new Set(allClient)).length > 1;

						// if project or client searched for, make it respective first
						const matchingProj = allProj.find(proj => proj.val == this.tablePagination.filter);
						if (matchingProj) {
							firstProj = matchingProj.val;
						}
						const matchingClient = allClient.find(client => client == this.tablePagination.filter);
						if (matchingClient) {
							firstClient = matchingClient;
						}

						tableItem.project = `${firstProj}${moreThanOneProj ? '...' : ''}`;
						tableItem.client = `${firstClient}${moreThanOneClient ? '...' : ''}`;
						tableItem.assignment = this.assigned;
						tableItem.allClients = allClient;
						tableItem.allProjects = allProj;
					}
					this.resProjClientTableData.push(tableItem);
				});
				this.resProjClientTableDataFiltered = this.resProjClientTableData;
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
						status: createProjectForm?.get('status')?.value,
					};
					const startDate = createProjectForm?.get('startDate')?.value;
					const projectManager = createProjectForm?.get('projectManager')?.value;

					if (clientName) {
						const createClientDto = {
							clientName,
						};
						// create client
						this.businessOwnerStore.dispatch(
							createClient({
								createClientDto,
							}),
						);

						// call with createdclient
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

					// after project is created, add project manager
					this.businessOwnerStore
						.select(selectCreatedProjectData)
						.pipe(takeUntil(this.$destroyed))
						.subscribe(data => {
							if (data) {
								const assignProjectDto = {
									startDate,
									title: 'Project Manager',
								};
								this.businessOwnerStore.dispatch(
									createResourceProjectAssignment({ resourceId: projectManager, projectId: data.id, assignProjectDto }),
								);

								// clean up values after we are done with them

								this.businessOwnerStore.dispatch(resetCreatedClientState());
								this.businessOwnerStore.dispatch(resetCreatedProjectState());
							}
						});
				}),
			)
			.subscribe(() => {
				if (this.manageResourcesForm.get('createProject')?.valid) {
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
					const assignDto: IAssignProjectDto = {
						title: this.manageResourcesForm.get('assign')?.get('title')?.value,
						startDate: this.manageResourcesForm.get('assign')?.get('startDate')?.value,
					};
					this.businessOwnerStore.dispatch(
						createResourceProjectAssignment({
							resourceId: this.manageResourcesForm.get('assign')?.get('resource')?.value,
							projectId: this.manageResourcesForm.get('assign')?.get('project')?.value,
							assignProjectDto: assignDto,
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

	tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize != this.tablePagination.pageSize) {
			this.tablePagination = {
				page: 0,
				pageSize: pageEvent.pageSize,
				filter: this.tablePagination.filter,
			};
		} else if (pageEvent.pageIndex != this.tablePagination.page) {
			this.tablePagination.page = pageEvent.pageIndex;
		}
		this.businessOwnerStore.dispatch(getAllResProjInfo(this.tablePagination));
	}

	search(searchTerm: string) {
		this.tablePagination = {
			page: 0,
			pageSize: this.tablePagination.pageSize,
			filter: searchTerm,
		};
		this.businessOwnerStore.dispatch(getAllResProjInfo(this.tablePagination));
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
		this.businessOwnerStore.dispatch(resetProjManagementState());
	}
}
