import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
	editResourceView,
	getAllViewsByResourceId,
	getResourceInformation,
	getViewById,
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceDetails,
	selectResourceViews,
	selectRevision,
	selectView,
} from '@tempus/client/onboarding-client/shared/data-access';
import { skip, Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewType } from '@tempus/shared-domain';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
import { Store } from '@ngrx/store';

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
		private sharedStore: Store<OnboardingClientState>,
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
		this.sharedStore.dispatch(getResourceInformation());
		this.sharedStore
			.select(selectResourceDetails)
			.pipe(take(1))
			.subscribe(resData => {
				const resourceId = resData.userId;

				// Load Secondary view from route
				const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
				if (viewId) {
					this.sharedStore
						.select(selectView)
						.pipe(takeUntil(this.destroyed$))
						.subscribe(view => {
							if (view) {
								this.newViewForm.setFormDataFromView(view);
							} else {
								this.sharedStore.dispatch(getViewById({ viewId }));
							}
						});
					// this.resourceService
					// 	.getViewById(viewId)
					// 	.pipe(take(1))
					// 	.subscribe(view => {
					// 		this.newViewForm.setFormDataFromView(view);
					// 	});
				} else {
					// Display latest Primary view

					this.sharedStore
						.select(selectResourceViews)
						.pipe(takeUntil(this.destroyed$))
						.subscribe(data => {
							if (data) {
								let filteredAndSortedViews = data.views?.filter(
									(view: { viewType: ViewType }) => view.viewType === ViewType.PRIMARY,
								);
								filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
								this.newViewForm.setFormDataFromView(filteredAndSortedViews[0]);
							} else {
								this.sharedStore.dispatch(
									getAllViewsByResourceId({
										resourceId,
										pageSize: 1000,
										pageNum: 0,
									}),
								);
							}
						});

					// this.resourceService
					// 	.getResourceProfileViews(resourceId)
					// 	.pipe(takeUntil(this.destroyed$))
					// 	.subscribe(data => {
					// 		let filteredAndSortedViews = data.views.filter(view => view.viewType === ViewType.PRIMARY);
					// 		filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
					// 		this.newViewForm.setFormDataFromView(filteredAndSortedViews[0]);
					// 	});
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
		this.sharedStore.dispatch(editResourceView({ viewId: this.newViewForm.currentViewId, newView }));
		this.sharedStore
			.select(selectRevision)
			.pipe(skip(1), takeUntil(this.destroyed$))
			.subscribe(revision => {
				if (revision) {
					if (newView.viewType === ViewType.PRIMARY) {
						window.location.reload();
					} else {
						// Navigate to new view
						this.router
							.navigate(['../', revision.views[revision.views.length - 1]?.id], {
								relativeTo: this.route,
							})
							.then(() => {
								window.location.reload();
							});
					}
				}
			});
		// this.resourceService
		// 	.editResourceView(this.newViewForm.currentViewId, newView)
		// 	.pipe(take(1))
		// 	.subscribe(revision => {
		// 		if (newView.viewType === ViewType.PRIMARY) {
		// 			window.location.reload();
		// 		} else {
		// 			// Navigate to new view
		// 			this.router
		// 				.navigate(['../', revision.views[revision.views.length - 1]?.id], {
		// 					relativeTo: this.route,
		// 				})
		// 				.then(() => {
		// 					window.location.reload();
		// 				});
		// 		}
		// 	});
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
