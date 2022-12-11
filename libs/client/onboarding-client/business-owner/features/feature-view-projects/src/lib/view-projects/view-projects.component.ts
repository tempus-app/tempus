/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	getAllProjectInfo,
	selectAllProjects,
	selectAsyncStatus,
	selectProjStatusUpdated,
	updateProjStatus,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import {
	AsyncRequestState,
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Column, ViewProjects, ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { take, Subject, takeUntil, finalize, skip } from 'rxjs';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ErorType, ProjectStatus, RoleType } from '@tempus/shared-domain';
import { isValidRole } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-view-projects',
	templateUrl: './view-projects.component.html',
	styleUrls: ['./view-projects.component.scss'],
})
export class ViewProjectsComponent implements OnInit {
	prefix = 'onboardingOwnerViewProjects';

	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 10;

	ButtonType = ButtonType;

	totalProjects = 0;

	roles: RoleType[] = [];

	roleType = RoleType;

	@ViewChild('projectStatusModal')
	projectStatusModal!: TemplateRef<unknown>;

	$projectStatusModalClosedEvent = new Subject<void>();

	constructor(
		private businessOwnerStore: Store<BusinessOwnerState>,
		private sharedStore: Store<OnboardingClientState>,
		private translateService: TranslateService,
		private fb: FormBuilder,
		private modalService: ModalService,
	) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}.main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'project',
						header: data.project,
						cell: (element: Record<string, unknown>) => `${element['project']}`,
					},
					{
						columnDef: 'name',
						header: data.name,
						cell: (element: Record<string, unknown>) => `${element['name']}`,
					},
					{
						columnDef: 'start_date',
						header: data.start_date,
						cell: (element: Record<string, unknown>) => `${element['start_date']}`,
					},
					{
						columnDef: 'status',
						header: data.status,
						cell: (element: Record<string, unknown>) => `${element['status']}`,
					},
					{
						columnDef: 'clientRepr',
						header: data.clientRepr,
						cell: (element: Record<string, any>) =>
							`<div class="demarginizedCell">${element['clientReprFullName']}<p id="resource" class="mat-caption">(${element.clientReprEmail})</p></div>`,
					},
				];
			});
	}

	updateProjectStatusForm = this.fb.group({
		project: ['', Validators.required],
		status: ['', Validators.required],
	});

	$destroyed = new Subject<void>();

	projectsInfoTableData: ViewProjects[] = [];

	projectOptions: { id: number; val: string }[] = [];

	selectedProjStatusOptions: ProjectStatus[] = [
		ProjectStatus.NOT_STARTED,
		ProjectStatus.ACTIVE,
		ProjectStatus.COMPLETED,
	];

	projStatusOptions: { id: number; opts: ProjectStatus[] }[] = [];

	ngOnInit(): void {
		this.businessOwnerStore.dispatch(getAllProjectInfo({ page: this.pageNum, pageSize: this.pageSize }));

		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.roles = data.roles;
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'projectStatusModal') {
				this.$projectStatusModalClosedEvent.next();
			}
		});

		this.businessOwnerStore
			.select(selectProjStatusUpdated)
			.pipe(takeUntil(this.$destroyed), skip(1))
			.subscribe(_ => {
				this.businessOwnerStore.dispatch(getAllProjectInfo({ page: this.pageNum, pageSize: this.pageSize }));
			});

		this.businessOwnerStore
			.select(selectAllProjects)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.projectsInfoTableData = [];
				this.totalProjects = data.totalItems;
				this.projectOptions = data.projects
					.filter(proj => proj.status !== ProjectStatus.COMPLETED)
					.map(proj => {
						return { id: proj.id, val: proj.name };
					});
				this.projStatusOptions = data.projects.map(proj => {
					const statusOptions = [];
					if (proj.status === ProjectStatus.NOT_STARTED) {
						statusOptions.push(ProjectStatus.ACTIVE);
						statusOptions.push(ProjectStatus.COMPLETED);
					} else if (proj.status === ProjectStatus.ACTIVE) {
						statusOptions.push(ProjectStatus.COMPLETED);
					}
					return { id: proj.id, opts: statusOptions };
				});
				data.projects.forEach(project => {
					const startDate = new Date(project.startDate).toISOString().slice(0, 10);
					const status = project.status.toString() === 'not_started' ? 'Not Started' : project.status;
					this.projectsInfoTableData.push({
						name: project.client.clientName,
						project: project.name,
						start_date: startDate,
						status,
						clientReprFullName: `${project.clientRepresentative.firstName} ${project.clientRepresentative.lastName}`,
						clientReprEmail: project.clientRepresentative.email,
						columnsWithIcon: [],
						columnsWithUrl: [],
						columnsWithChips: [],
						columnsWithButtonIcon: [],
					});
				});
			});

		this.businessOwnerStore
			.select(selectAsyncStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(asyncStatus => {
				if (
					asyncStatus.status === AsyncRequestState.ERROR &&
					asyncStatus.error &&
					asyncStatus.error.name !== ErorType.INTERCEPTOR
				) {
					this.openErrorModal(asyncStatus.error.message);
				}
			});
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	isValidRole = isValidRole;

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

	updateSelectedProject = (id: number) => {
		const selectedOpts = this.projStatusOptions.find(opt => opt.id === id)?.opts;
		this.selectedProjStatusOptions = selectedOpts || [];
	};

	updateProjectStatus = () => {
		this.translateService
			.get(`${this.prefix}.projectStatusModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data.title,
						id: 'projectStatusModal',
						closable: true,
						confirmText: data.confirmText,
						modalType: ModalType.INFO,
						closeText: data.closeText,
						template: this.projectStatusModal,
						subtitle: data.subtitle,
					},
					CustomModalType.CONTENT,
				);
			});
		this.modalService.confirmDisabled()?.next(true);
		this.updateProjectStatusForm?.valueChanges
			.pipe(
				takeUntil(this.$projectStatusModalClosedEvent),
				finalize(() => {
					const project: number = this.updateProjectStatusForm.get('project')?.value;
					const status: ProjectStatus = this.updateProjectStatusForm.get('status')?.value;
					this.updateProjectStatusForm.reset();
					this.businessOwnerStore.dispatch(updateProjStatus({ projId: project, status }));
				}),
			)
			.subscribe(() => {
				if (this.updateProjectStatusForm.valid) {
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
	};

	resetModalData() {
		this.updateProjectStatusForm = this.fb.group({
			project: ['', Validators.required],
			status: ['', Validators.required],
		});
	}

	tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize !== this.pageSize) {
			this.pageSize = pageEvent.pageSize;
			this.pageNum = 0;
		} else if (pageEvent.pageIndex !== this.pageNum) {
			this.pageNum = pageEvent.pageIndex;
		}
		this.businessOwnerStore.dispatch(getAllProjectInfo({ page: this.pageNum, pageSize: this.pageSize }));
	}
}
