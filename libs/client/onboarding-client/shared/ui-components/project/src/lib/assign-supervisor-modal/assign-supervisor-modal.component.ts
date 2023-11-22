/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	selectResourceBasicData,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { User, Resource, IUpdateResourceDto } from '@tempus/shared-domain';
import { Router } from '@angular/router';
import { take, takeUntil, finalize, Subject } from 'rxjs';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';

@Component({
	selector: 'tempus-assign-supervisor-modal',
	templateUrl: './assign-supervisor-modal.component.html',
	styleUrls: ['./assign-supervisor-modal.component.scss'],
})
export class AssignSupervisorModalComponent implements OnInit {
	constructor(
		private modalService: ModalService,
		private businessOwnerStore: Store<BusinessOwnerState>,
		private fb: FormBuilder,
		private translateService: TranslateService,
		private router: Router,
    private resourceService: OnboardingClientResourceService,
	) {}

	@Input()
	resource: Resource | undefined = undefined;

	resourceOptions: { val: string; id: number }[] = [];

	@Input() resourceName = '';

	@Input() resourceId = 0;

  currentSupervisors: { val: string; id: number }[] = [];

	commonPrefix = 'onboardingClient.input.common.';

	@ViewChild('assignTemplate')
	assignModal!: TemplateRef<unknown>;

	$destroyed = new Subject<void>();

	$assignModalClosedEvent = new Subject<void>();

	InputType = InputType;

	prefix = 'modal.assignModal';

	assignForm = this.fb.group({
		resource: ['', Validators.required],
		supervisor: ['', Validators.required],
	});

	ngOnInit(): void {

		// Getting all resources (basic info i.e firstname, lastname, email, id)
		this.businessOwnerStore
			.select(selectResourceBasicData)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.resourceOptions = data.map(res => {
					return {
						val: `${res.firstName} ${res.lastName}`,
						id: res.id,
					};
				});
			});

    this.resourceService
			.getSupervisors()
			.subscribe(data => {
				this.currentSupervisors = data.map(res => {
					return {
						val: `${res.firstName} ${res.lastName}`,
						id: res.id,
					};
				});
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.$destroyed)).subscribe(modalId => {
			this.modalService.close();
			if (modalId === 'assignModal') {
				this.$assignModalClosedEvent.next();
			}
		});
	}

	assign() {
		this.translateService
			.get(`modal.assignModal`)
			.pipe(take(1))
			.subscribe(data => {
				this.translateService
					.get('modal.assignModal.title', { resourceName: this.resourceName || 'Resource' })
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
					this.resourceService.assignSupervisorToResource(
            this.assignForm.get('resource')?.value,
            this.assignForm.get('supervisor')?.value,
          )
          .subscribe(
            result =>{
              console.log(result);
            },
            error => {
              console.log(error)
            }
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
			});
	}
}
