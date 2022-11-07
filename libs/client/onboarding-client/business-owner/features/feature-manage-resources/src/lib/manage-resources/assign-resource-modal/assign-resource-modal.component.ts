import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	createResourceProjectAssignment,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { Client, IAssignProjectDto } from '@tempus/shared-domain';
import { Router } from '@angular/router';
import { take, takeUntil, finalize, Subject } from 'rxjs';
import { ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';

@Component({
	selector: 'tempus-assign-resource-modal',
	templateUrl: './assign-resource-modal.component.html',
	styleUrls: ['./assign-resource-modal.component.scss'],
})
export class AssignResourceModalComponent implements OnInit {
	constructor(
		private modalService: ModalService,
		private businessOwnerStore: Store<BusinessOwnerState>,
		private fb: FormBuilder,
		private translateService: TranslateService,
		private router: Router,
	) {}

	@Input()
	clientOptions: { val: string; id: number }[] = [];

	@Input()
	clients: Client[] = [];

	@Input()
	resourceOptions: { val: string; id: number }[] = [];

	@Input()
	resProjClientTableData: ProjectManagmenetTableData[] = [];

	currentProjects: { val: string; id: number }[] = [];

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
		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'assignModal') {
				this.$assignModalClosedEvent.next();
			}
		});
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
		if (resource) {
			this.filterCurrentProjectsBySelectedResource(resource);
		}
	};

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
			.get(`${this.prefix}modal.assignModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data.title,
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
			});
	}
}

// need to pass the lists as a prop
// can control the assign/close within the modal
// pass resource as prop
// should control form elements?
