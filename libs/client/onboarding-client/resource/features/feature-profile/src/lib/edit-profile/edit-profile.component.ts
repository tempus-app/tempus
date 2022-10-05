import { Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnDestroy {
	constructor(
		public modalService: ModalService,
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@ViewChild(EditViewFormComponent) newViewForm!: EditViewFormComponent;

	@Output()
	closeEditViewClicked = new EventEmitter();

	destroyed$ = new Subject<void>();

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	updateView() {
		const newView = this.newViewForm.generateNewView();
		this.resourceService.editResourceView(this.newViewForm.currentViewId, newView).pipe(take(1)).subscribe();
	}

	openSubmitConfirmation() {
		this.translateService
			.get([`onboardingResourceEditProfile.modal.submitModal`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingResourceEditProfile.modal.submitModal`];
				this.modalService.open(
					{
						title: dialogText.title,
						closeText: dialogText.closeText,
						confirmText: dialogText.confirmText,
						message: dialogText.message,
						closable: true,
						id: 'submit',
						modalType: ModalType.WARNING,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
			this.updateView();
			this.modalService.close();
			this.closeEditView();
			window.location.reload();
		});
	}

	closeEditView() {
		this.closeEditViewClicked.emit();
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
