import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { Subject, take } from 'rxjs';

@Component({
	selector: 'tempus-create-new-view',
	templateUrl: './create-new-view.component.html',
	styleUrls: ['./create-new-view.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class CreateNewViewComponent implements OnInit, OnDestroy {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
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

	userId = 0;

	destroyed$ = new Subject<void>();

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
		});
	}

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	createNewView() {
		const newView = this.newViewForm.generateNewView();
		this.resourceService.createSecondaryView(this.userId, newView).subscribe();
	}

	openSubmitConfirmation() {
		this.translateService
			.get([`onboardingResourceCreateNewView.modal.submitModal`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingResourceCreateNewView.modal.submitModal`];
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
		// TODO: navigate to new view
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
