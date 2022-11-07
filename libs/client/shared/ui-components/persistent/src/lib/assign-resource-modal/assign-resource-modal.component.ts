/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	createResourceProjectAssignment,
	getAllClients,
	selectClientData,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { Client, IAssignProjectDto, ProjectResource, Resource } from '@tempus/shared-domain';
import { Router } from '@angular/router';
import { take, takeUntil, finalize, Subject } from 'rxjs';
import { ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';

@Component({
	selector: 'tempus-assign-resource-modal',
	templateUrl: './assign-resource-modal.component.html',
	styleUrls: ['./assign-resource-modal.component.scss'],
})
export class AssignResourceModalComponent implements OnInit, OnChanges {
	constructor(
		private modalService: ModalService,
		private businessOwnerStore: Store<BusinessOwnerState>,
		private fb: FormBuilder,
		private translateService: TranslateService,
		private router: Router,
	) {}

	@Input()
	resource: Resource | undefined = undefined;

	@Input()
	resourceOptions: { val: string; id: number }[] = [];

	@Input()
	resProjClientTableData: ProjectManagmenetTableData[] = [];

	// this is the case when we are assigning specific to project, so modal is disabled

	@Input() resourceName = '';

	@Input() resourceEmail = '';

	@Input() resourceId = 0;

	@Input() selectResource = false;

	@Input()
	projectResources: ProjectResource[] = [];

	currentProjects: { val: string; id: number }[] = [];

	clients: Client[] = [];

	clientOptions: { val: string; id: number }[] = [];

	prefix = 'onboardingOwnerManageResources.';

	commonPrefix = 'onboardingClient.input.common.';

	@ViewChild('assignTemplate')
	assignModal!: TemplateRef<unknown>;

	$destroyed = new Subject<void>();

	$assignModalClosedEvent = new Subject<void>();

	InputType = InputType;

	assignForm = this.fb.group({
		resource: ['', Validators.required],
		client: ['', Validators.required],
		project: ['', Validators.required],
		startDate: ['', Validators.required],
		title: ['', Validators.required],
	});

	ngOnInit(): void {
		this.businessOwnerStore.dispatch(getAllClients());

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

		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'assignModal') {
				this.$assignModalClosedEvent.next();
			}
		});

		if (this.selectResource) {
			this.setResourceDetails();
			this.filterCurrentProjectsResource();
		}
	}

	setResourceDetails = () => {
		this.resourceOptions = [{ val: `${this.resourceName} (${this.resourceEmail})`, id: this.resourceId }];
		this.assignForm.controls['resource']?.setValue(this.resourceId);
		this.assignForm.controls['resource']?.disable();
	};

	ngOnChanges() {
		if (this.selectResource) {
			this.setResourceDetails();
			this.filterCurrentProjectsResource();
		}
	}

	updateProjects = () => {
		const id = this.assignForm.get('client')?.value;
		this.currentProjects =
			this.clients
				.find(client => client.id === id)
				?.projects.map(proj => {
					return {
						val: proj.name,
						id: proj.id,
					};
				}) || [];
		const resource = this.assignForm.get('resource')?.value;
		if (resource && !this.selectResource) {
			this.filterCurrentProjectsBySelectedResource(resource);
		}
		if (this.selectResource) {
			this.filterCurrentProjectsResource();
		}
	};

	filterCurrentProjectsResource() {
		this.currentProjects = this.currentProjects.filter(curFilteredProj => {
			if (this.projectResources && this.projectResources.length > 0) {
				return !this.projectResources.some(projRes => projRes.project.id === curFilteredProj.id);
			}
			return true;
		});
	}

	filterCurrentProjectsBySelectedResource(resource: string) {
		const curSelectedRes = resource;
		this.currentProjects = this.currentProjects.filter(curFilteredProj => {
			if (curSelectedRes) {
				const curResProjClientTableDatum = this.resProjClientTableData.find(
					resProjClient => resProjClient.resourceId === parseInt(curSelectedRes, 10),
				);
				if (curResProjClientTableDatum && curResProjClientTableDatum?.allProjects.length > 0) {
					return !curResProjClientTableDatum?.allProjects.some(proj => proj.id === curFilteredProj.id);
				}
				return true;
			}
			return true;
		});
	}

	// Shouldnt see a projectif the currently selected resource is already assigned to it

	assign() {
		this.translateService
			.get(`assignModal`, { resourceName: 'John' })
			.pipe(take(1))
			.subscribe(data => {
				this.translateService
					.get('assignModal.title', { resourceName: this.resourceName || 'Resource' })
					.subscribe((updatedTitle: string) => {
						this.modalService.open(
							{
								title: updatedTitle,
								id: 'assignModal',
								closable: true,
								confirmText: data.confirmText,
								modalType: ModalType.INFO,
								closeText: data.closeText,
								template: this.assignModal,
							},
							CustomModalType.CONTENT,
						);
					});
			});
		this.modalService.confirmDisabled()?.next(true);
		this.assignForm.valueChanges
			.pipe(
				takeUntil(this.$assignModalClosedEvent),
				finalize(() => {
					const assignDto: IAssignProjectDto = {
						title: this.assignForm.get('title')?.value,
						startDate: this.assignForm.get('startDate')?.value,
					};
					this.businessOwnerStore.dispatch(
						createResourceProjectAssignment({
							resourceId: this.assignForm.get('resource')?.value,
							projectId: this.assignForm.get('project')?.value,
							assignProjectDto: assignDto,
						}),
					);
				}),
			)
			.subscribe(() => {
				if (this.assignForm.valid) {
					this.modalService.confirmDisabled()?.next(false);
				} else {
					this.modalService.confirmDisabled()?.next(true);
				}
			});
		this.modalService
			.closed()
			.pipe(take(1))
			.subscribe(() => {
				this.assignForm.reset();
				this.currentProjects = [];

				// don't want to reset resource name
				if (this.selectResource) {
					this.setResourceDetails();
				}
			});
	}
}

// need to pass the lists as a prop
// can control the assign/close within the modal
// pass resource as prop
// should control form elements?
