/* eslint-disable @typescript-eslint/dot-notation */
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
	downloadProfileByViewId,
	OnboardingClientState,
	OnboardingClientViewsService,
	selectDownloadProfile,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { catchError, of, Subject, take, takeUntil } from 'rxjs';
import { LoadView, ProjectResource, RoleType, ViewNames } from '@tempus/shared-domain';
import { ButtonType, SnackbarService } from '@tempus/client/shared/ui-components/presentational';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { TranslateService } from '@ngx-translate/core';
import { isValidRole } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnChanges {
	@Input() loadedView: LoadView = { isRevision: false };

	@Input() resourceName = '';

	@Input() resourceEmail = '';

	@Input() resourceId = 0;

	@Input()
	projectResources: ProjectResource[] = [];

	@Input() roles: RoleType[] = [];

	viewNames: string[] = [];

	viewIDs: number[] = [];

	currentViewID = 0;

	viewDropDownForm = this.fb.group({
		viewSelected: [''],
	});

	buttonType = ButtonType;

	viewResourceProfilePrefx = 'viewResourceProfile.';

	destroyed$ = new Subject<void>();
	// eslint-disable-next-line @typescript-eslint/lines-between-class-members
	isValidRole = isValidRole;

	roleType = RoleType;

	@Output() newViewSelected = new EventEmitter<number>();

	@Output() editViewSelected = new EventEmitter();

	constructor(
		private route: ActivatedRoute,
		private modalService: ModalService,
		private translateService: TranslateService,
		private viewsService: OnboardingClientViewsService,
		private fb: FormBuilder,
		private router: Router,
		private sharedStore: Store<OnboardingClientState>,
		private snackbar: SnackbarService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnChanges(): void {
		if (this.loadedView.resourceViews) {
			this.viewNames = this.loadedView.resourceViews.map((view: ViewNames) => view.type);
			this.viewIDs = this.loadedView.resourceViews.map((view: ViewNames) => view.id);
		}
		if (this.loadedView.currentViewName) {
			this.viewDropDownForm.patchValue({
				viewSelected: this.loadedView.currentViewName,
			});
			this.currentViewID = parseInt(this.route.snapshot.queryParamMap.get('viewId') || '0', 10);
		}
	}

	downloadProfile() {
		// Taken from https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
		this.sharedStore.dispatch(downloadProfileByViewId({ viewId: this.currentViewID }));

		this.sharedStore
			.select(selectDownloadProfile)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				if (data) {
					const downloadURL = window.URL.createObjectURL(data);
					const link = document.createElement('a');
					link.href = downloadURL;
					const index = this.viewIDs.indexOf(this.currentViewID);
					link.download = `${this.resourceName}-${this.viewNames[index]}`;
					link.click();
				}
			});
		// this.resourceService.downloadProfile(this.currentViewID).subscribe(data => {
		// 	const downloadURL = window.URL.createObjectURL(data);
		// 	const link = document.createElement('a');
		// 	link.href = downloadURL;
		// 	const index = this.viewIDs.indexOf(this.currentViewID);
		// 	link.download = `${this.resourceName}-${this.viewNames[index]}`;
		// 	link.click();
		// });
		this.translateService
			.get(`${this.viewResourceProfilePrefx}downloadDialog`)
			.pipe(take(1))
			.subscribe(data => {
				this.snackbar.open(data['message']);
			});
	}

	deleteView() {
		this.translateService
			.get([`viewResourceProfile.deleteViewModal`])
			.pipe(take(1))
			.subscribe(data => {
				this.translateService
					.get(`viewResourceProfile.deleteViewModal.title`, {
						viewName: this.loadedView.currentViewName,
					})
					.subscribe(modalTitle => {
						const dialogText = data[`viewResourceProfile.deleteViewModal`];
						this.modalService.open(
							{
								title: modalTitle,
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
			});

		this.modalService.confirmEventSubject.pipe(take(1)).subscribe(() => {
			this.modalService.close();

			// convert to store
			this.viewsService
				.deleteView(this.currentViewID)
				.pipe(catchError(error => of(error)))
				.subscribe(error => {
					if (error) {
						this.openDeleteViewErrorModal(error.message);
					} else {
						this.modalService.confirmEventSubject.unsubscribe();
						this.router.navigate(['../', this.resourceId], { relativeTo: this.route }).then(() => {
							window.location.reload();
						});
					}
				});

			this.modalService.close();
		});
	}

	openDeleteViewErrorModal(error: string) {
		this.translateService
			.get(`viewResourceProfile.deleteViewErrorModal.confirmText`)
			.pipe(take(1))
			.subscribe(confirm => {
				this.modalService.open(
					{
						title: error,
						confirmText: confirm,
						closable: true,
						id: 'error',
						modalType: ModalType.ERROR,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
			this.modalService.close();
		});
	}

	onClick(optionSelected: string): void {
		const index = this.viewNames.indexOf(optionSelected);
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { viewId: this.viewIDs[index] },
		});
		this.newViewSelected.emit(this.viewIDs[index]);
	}

	openViewForm() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}

	openEditView() {
		this.editViewSelected.emit();
	}
}
