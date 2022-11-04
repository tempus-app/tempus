import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewType } from '@tempus/shared-domain';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
	constructor(
		public modalService: ModalService,
		private router: Router,
		private route: ActivatedRoute,
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

	ngOnInit(): void {
		this.resourceService
			.getResourceInformation()
			.pipe(take(1))
			.subscribe(resData => {
				const resourceId = resData.id;

				// Load Secondary view from route
				const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
				if (viewId) {
					this.resourceService
						.getViewById(viewId)
						.pipe(take(1))
						.subscribe(view => {
							this.newViewForm.setFormDataFromView(view);
						});
				} else {
					// Display latest Primary view
					this.resourceService
						.getResourceProfileViews(resourceId)
						.pipe(takeUntil(this.destroyed$))
						.subscribe(views => {
							let filteredAndSortedViews = views.filter(view => view.viewType === ViewType.PRIMARY);
							filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
							this.newViewForm.setFormDataFromView(filteredAndSortedViews[0]);
						});
				}
			});
	}

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	updateView() {
		const newView = this.newViewForm.generateNewView();
		this.resourceService
			.editResourceView(this.newViewForm.currentViewId, newView)
			.pipe(take(1))
			.subscribe(revision => {
				if (newView.viewType === ViewType.PRIMARY) {
					window.location.reload();
				} else {
					// Navigate to new view
					this.router
						.navigate(['../', revision.views?.pop()?.id], {
							relativeTo: this.route,
						})
						.then(() => {
							window.location.reload();
						});
				}
			});
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
