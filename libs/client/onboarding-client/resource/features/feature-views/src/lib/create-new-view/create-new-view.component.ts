import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-form/src/lib/edit-view-form/edit-view-form.component';
import { Subject, take } from 'rxjs';

@Component({
	selector: 'tempus-create-new-view',
	templateUrl: './create-new-view.component.html',
	styleUrls: ['./create-new-view.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class CreateNewViewComponent {
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
	closeFormClicked = new EventEmitter();

	destroyed$ = new Subject<void>();

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	createNewView() {
		try {
			// const newView = this.newViewForm.generateNewView();
			// this.resourceService.editResourceView(this.newViewForm.currentViewId, newView).pipe(take(1)).subscribe();
		} catch (e) {
			console.log(e);
		}
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

		this.modalService.confirmEventSubject.subscribe(() => {
			this.createNewView();
			this.modalService.close();
			this.closeForm();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	closeForm() {
		this.closeFormClicked.emit();
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
