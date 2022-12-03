import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	createClient,
	selectCreatedClientData,
	createProject,
	selectCreatedProjectData,
	createResourceProjectAssignment,
	resetCreatedClientState,
	resetCreatedProjectState,
	getAllClients,
	getAllResourceInfoBasic,
	resetAsyncStatusState,
	selectAsyncStatus,
	selectClientData,
	selectResourceBasicData,
	resetProjManagementState,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import {
	OnboardingClientState,
	OnboardingClientProjectService,
	AsyncRequestState,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { Client, ErorType } from '@tempus/shared-domain';
import { take, takeUntil, finalize, Subject } from 'rxjs';

@Component({
	selector: 'tempus-create-project',
	templateUrl: './create-project.component.html',
	styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit, OnDestroy {
	@ViewChild('newProjectTemplate')
	newProjectModal!: TemplateRef<unknown>;

	prefix = '';

	$destroyed = new Subject<void>();

	$createProjectModalClosedEvent = new Subject<void>();

	clients: Array<Client> = [];

	clientOptions: { val: string; id: number }[] = [];

	resourceOptions: { val: string; id: number }[] = [];

	loading = false;

	createProjectForm = this.fb.group({
		client: [null, Validators.required],
		clientName: [''],
		clientRepresentative: [null],
		clientRepFirstName: ['', Validators.required],
		clientRepLastName: ['', Validators.required],
		clientRepEmail: ['', [Validators.email, Validators.required]],
		startDate: ['', Validators.required],
		status: ['', Validators.required],
		name: ['', Validators.required],
		projectManager: ['', Validators.required],
	});

	constructor(
		private modalService: ModalService,
		private businessOwnerStore: Store<BusinessOwnerState>,
		private sharedStore: Store<OnboardingClientState>,
		private fb: FormBuilder,
		private translateService: TranslateService,
		private projectService: OnboardingClientProjectService,
	) {}

	ngOnInit(): void {
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'newProjectModal') {
				this.$createProjectModalClosedEvent.next();
			} else if (modalId === 'error') {
				this.businessOwnerStore.dispatch(resetAsyncStatusState());
			}
		});

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

		this.businessOwnerStore.dispatch(getAllClients());
		this.businessOwnerStore.dispatch(getAllResourceInfoBasic());

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
	}

	createProjectModal() {
		this.translateService
			.get(`modal.newProjectModal`)
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
		this.modalService.confirmDisabled()?.next(true);
		this.createProjectForm.valueChanges
			.pipe(
				takeUntil(this.$createProjectModalClosedEvent),
				finalize(() => {
					const clientName = this.createProjectForm?.get('clientName')?.value;
					const projectData = {
						name: this.createProjectForm?.get('name')?.value,
						startDate: this.createProjectForm?.get('startDate')?.value,
						clientRepresentativeFirstName: this.createProjectForm?.get('clientRepFirstName')?.value,
						clientRepresentativeLastName: this.createProjectForm?.get('clientRepLastName')?.value,
						clientRepresentativeEmail: this.createProjectForm?.get('clientRepEmail')?.value,
						clientRepresentativeId: this.createProjectForm?.get('clientRepresentative')?.value,
						status: this.createProjectForm?.get('status')?.value,
					};
					const startDate = this.createProjectForm?.get('startDate')?.value;
					const projectManager = this.createProjectForm?.get('projectManager')?.value;

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
						const createProjectDto = {
							...projectData,
							clientId: this.createProjectForm?.get('client')?.value,
						};
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
									createResourceProjectAssignment({
										resourceId: projectManager,
										projectId: data.id,
										assignProjectDto,
									}),
								);

								// clean up values after we are done with them

								this.businessOwnerStore.dispatch(resetCreatedClientState());
								this.businessOwnerStore.dispatch(resetCreatedProjectState());
							}
						});
				}),
			)
			.subscribe(() => {
				if (this.createProjectForm.valid) {
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

	resetModalData = () => {
		this.createProjectForm.reset();
	};

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
		this.businessOwnerStore.dispatch(resetProjManagementState());
	}
}
