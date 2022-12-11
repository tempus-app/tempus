import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	createResourceView,
	getAllViewsByResourceId,
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceViews,
	selectView,
} from '@tempus/client/onboarding-client/shared/data-access';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';
import { RevisionType, ViewType } from '@tempus/shared-domain';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-business-owner-create-new-view',
	templateUrl: './create-new-view.component.html',
	styleUrls: ['./create-new-view.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class BusinessOwnerCreateNewViewComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private resourceService: OnboardingClientResourceService,
		private sharedStore: Store<OnboardingClientState>,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@ViewChild(EditViewFormComponent) newViewForm!: EditViewFormComponent;

	resourceId = 0;

	destroyed$ = new Subject<void>();

	ngOnInit(): void {
		this.resourceId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

		// New view form loaded with latest approved Primary view
		this.sharedStore.dispatch(getAllViewsByResourceId({ resourceId: this.resourceId, pageNum: 0, pageSize: 1000 }));
		this.sharedStore
			.select(selectResourceViews)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				const filteredViews = data.views.filter(
					view => view.viewType === ViewType.PRIMARY && view.revisionType === RevisionType.APPROVED,
				);
				this.newViewForm.setFormDataFromView(filteredViews[0]);
				this.newViewForm.enableViewNameField();
			});
		// this.resourceService.getResourceProfileViews(this.resourceId).subscribe(data => {
		// 	const filteredViews = data.views.filter(
		// 		view => view.viewType === ViewType.PRIMARY && view.revisionType === RevisionType.APPROVED,
		// 	);
		// 	this.newViewForm.setFormDataFromView(filteredViews[0]);
		// 	this.newViewForm.enableViewNameField();
		// });
	}

	submitChanges() {
		if (this.newViewForm.validateForm()) {
			this.createNewView();
		}
	}

	createNewView() {
		const newView = this.newViewForm.generateNewView();
		this.sharedStore.dispatch(createResourceView({ resourceId: this.resourceId, newView }));
		this.sharedStore
			.select(selectView)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(resourceView => {
				this.router.navigate(['../'], {
					queryParams: { viewId: resourceView?.id },
					relativeTo: this.route,
				});
			});
		// this.resourceService
		// 	.createSecondaryView(this.resourceId, newView)
		// 	.pipe(take(1))
		// 	.subscribe(view => {
		// 		this.router.navigate(['../'], {
		// 			queryParams: { viewId: view.id },
		// 			relativeTo: this.route,
		// 		});
		// 	});
	}

	closeForm() {
		this.router.navigate(['../'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}
}
