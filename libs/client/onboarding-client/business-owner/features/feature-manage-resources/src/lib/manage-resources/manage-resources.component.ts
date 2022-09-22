/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable class-methods-use-this */
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	createLink,
	createResourceProjectAssignment,
	getAllClients,
	getAllResProjInfo,
	resetAsyncStatusState,
	resetProjManagementState,
	selectAsyncStatus,
	selectClientData,
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
import { Client, ICreateLinkDto } from '@tempus/shared-domain';
import { finalize, Subject, Subscription, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'tempus-manage-resources',
	templateUrl: './manage-resources.component.html',
	styleUrls: ['./manage-resources.component.scss'],
})
export class ManageResourcesComponent implements OnInit, OnDestroy {
	userType = UserType;

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
							`<div class="demarginizedCell">${element['resource']}<p class="mat-caption">(${element['email']})</p></div>`,
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

	$destroyed = new Subject<void>();

	$inviteModalClosedEvent = new Subject<void>();

	$assignModalClosedEvent = new Subject<void>();

	ButtonType = ButtonType;

	InputType = InputType;

	loading = false;

	currentProjects: { val: string; id: number }[] = [];

	clientOptions: { val: string; id: number }[] = [];

	resourceOptions: { val: string; id: number }[] = [];

	clients: Array<Client> = [];

	resProjClientTableData: ProjectManagmenetTableData[] = [];

	resProjClientTableDataFiltered: ProjectManagmenetTableData[] = [];

	// For use in the search box
	allSearchTerms: string[] = [];

	manageResourcesForm = this.fb.group({
		search: [''],
		invite: this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			emailAddress: ['', [Validators.required, Validators.email]],
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

	assigned = '';

	unassigned = '';

	awaitingApproval = '';

	@ViewChild('inviteTemplate')
	inviteModal!: TemplateRef<unknown>;

	@ViewChild('assignTemplate')
	assignModal!: TemplateRef<unknown>;

	tableColumns: Array<Column> = [];

	modalServiceConfirmEvent: Subscription | undefined;

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'inviteModal') {
				this.$inviteModalClosedEvent.next();
			} else if (modalId === 'assignModal') {
				this.$assignModalClosedEvent.next();
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
					asyncStatus.error.name != 'intercept'
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
			?.valueChanges.pipe(
				takeUntil(this.$inviteModalClosedEvent),
				finalize(() => {
					this.businessOwnerStore.dispatch(
						createLink({
							createLinkDto: {
								firstName: this.manageResourcesForm.get('invite')?.get('firstName')?.value,
								lastName: this.manageResourcesForm.get('invite')?.get('lastName')?.value,
								email: this.manageResourcesForm.get('invite')?.get('emailAddress')?.value,
								projectId: this.manageResourcesForm.get('invite')?.get('project')?.value,
							} as ICreateLinkDto,
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
		this.manageResourcesForm.get('invite')?.reset();
		this.manageResourcesForm.get('assign')?.reset();
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
