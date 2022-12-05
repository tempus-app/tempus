import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	createResourceView,
	getAllViewsByResourceId,
	getResourceInformation,
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceDetails,
	selectResourceViews,
	selectView,
} from '@tempus/client/onboarding-client/shared/data-access';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { RevisionType, ViewType } from '@tempus/shared-domain';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-resource-create-new-view',
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
		private sharedStore: Store<OnboardingClientState>,
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
		this.sharedStore.dispatch(getResourceInformation());
		this.sharedStore
			.select(selectResourceDetails)
			.pipe(take(1))
			.subscribe(resData => {
				this.userId = resData.userId;
				this.sharedStore.dispatch(
					getAllViewsByResourceId({
						resourceId: this.userId,
						pageSize: 1000,
						pageNum: 0,
					}),
				);
				this.sharedStore
					.select(selectResourceViews)
					.pipe(takeUntil(this.destroyed$))
					.subscribe(data => {
						const approvedPrimaryView = data.views?.find(
							view => view.revisionType === RevisionType.APPROVED && view.viewType === ViewType.PRIMARY,
						);
						if (approvedPrimaryView) {
							this.newViewForm.setFormDataFromView(approvedPrimaryView);
							this.newViewForm.enableViewNameField();
						}
					});
			});

		// this.resourceService
		// 	.getResourceInformation()
		// 	.pipe(take(1))
		// 	.subscribe(resData => {
		// 		this.userId = resData.id;
		// 		this.resourceService
		// 			.getResourceProfileViews(this.userId)
		// 			.pipe(takeUntil(this.destroyed$))
		// 			.subscribe(data => {
		// 				const approvedPrimaryView = data.views?.find(
		// 					view => view.revisionType === RevisionType.APPROVED && view.viewType === ViewType.PRIMARY,
		// 				);
		// 				if (approvedPrimaryView) {
		// 					this.newViewForm.setFormDataFromView(approvedPrimaryView);
		// 					this.newViewForm.enableViewNameField();
		// 				}
		// 			});
		// 	});
	}

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.openSubmitConfirmation();
		}
	}

	createNewView() {
		const newView = this.newViewForm.generateNewView();
		this.sharedStore.dispatch(createResourceView({ resourceId: this.userId, newView }));
		this.sharedStore
			.select(selectView)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(resourceView => {
				this.router.navigate(['../', resourceView?.id], {
					relativeTo: this.route,
				});
			});

		// this.resourceService
		// 	.createSecondaryView(this.userId, newView)
		// 	.pipe(take(1))
		// 	.subscribe(view => {
		// 		this.router.navigate(['../', view.id], {
		// 			relativeTo: this.route,
		// 		});
		// 	});
	}

	openSubmitConfirmation() {
		this.translateService
			.get([`onboardingResourceCreateNewView.submitModal`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingResourceCreateNewView.submitModal`];
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
			this.createNewView();
			this.modalService.close();
		});
	}

	closeForm() {
		this.router.navigate(['../'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
