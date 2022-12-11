/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	getResourceInformation,
	getResourceInformationById,
	getViewById,
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceDetails,
	selectResourceViews,
	selectView,
	OnboardingClientViewsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { skip, catchError, of, Subject, take, takeUntil } from 'rxjs';
import { ButtonType, SnackbarService } from '@tempus/client/shared/ui-components/presentational';
import {
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ViewType,
	RevisionType,
	View,
} from '@tempus/shared-domain';
import {
	downloadProfileByViewId,
	getAllViewsByResourceId,
	getResourceOriginalResumeById,
	selectDownloadProfile,
	selectResourceOriginalResume,
} from '@tempus/client/onboarding-client/resource/data-access';
import { TranslateService } from '@ngx-translate/core';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class ProfileComponent implements OnInit, OnDestroy {
	pageNum = 0;

	// make it very large so that it fetches all the views of the user
	pageSize = 1000;

	totalViews = 0;

	constructor(
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private resourceService: OnboardingClientResourceService,
		private viewsService: OnboardingClientViewsService,
		private modalService: ModalService,
		private snackbar: SnackbarService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	dataLoaded = false;

	userId = 0;

	currentViewId = 0;

	pageTitle = '';

	viewName = '';

	firstName = '';

	lastName = '';

	fullName = '';

	resume: File | null = null;

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	profilePrefix = 'onboardingResourceProfile.';

	ButtonType = ButtonType;

	isPendingApproval = false;

	isRejected = false;

	rejectionComments = '';

	editViewEnabled = false;

	isPrimaryView = false;

	ngOnInit(): void {
		this.sharedStore.dispatch(getResourceInformation());
		this.sharedStore
			.select(selectResourceDetails)
			.pipe(take(1))
			.subscribe(data => {
				this.userId = data.userId;
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
			});

		this.sharedStore.dispatch(getResourceOriginalResumeById({ resourceId: this.userId }));
		this.sharedStore
			.select(selectResourceOriginalResume)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});

		// display latest primary view
		// this.resourceStore
		// 	.select(selectResourceViews)
		// 	.pipe(takeUntil(this.destroyed$))
		// 	.subscribe(data => {
		// 		let filteredAndSortedViews = data?.views?.filter(view => view.viewType === ViewType.PRIMARY) || [];
		// 		filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);

		// 		const latestView = filteredAndSortedViews[0];
		// 		console.log(latestView);
		// 		this.currentViewId = latestView.id;
		// 		this.certifications = latestView.certifications;
		// 		this.educations = latestView.educations;
		// 		this.educationsSummary = latestView.educationsSummary;
		// 		this.workExperiences = latestView.experiences;
		// 		this.experiencesSummary = latestView.experiencesSummary;
		// 		this.profileSummary = latestView.profileSummary;
		// 		this.skills = latestView.skills.map(skill => skill.skill.name);
		// 		this.skillsSummary = latestView.skillsSummary;
		// 		this.isRejected = latestView.revisionType === RevisionType.REJECTED;
		// 		this.isPendingApproval = latestView.revisionType === RevisionType.PENDING;
		// 		this.rejectionComments = latestView.revision?.comment ? latestView.revision.comment : '';

		// 		this.dataLoaded = true;
		// 	});

		const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		if (viewId) {
			this.sharedStore.dispatch(getViewById({ viewId }));
			this.sharedStore
				.select(selectView)
				.pipe(takeUntil(this.destroyed$))
				.subscribe(resourceView => {
					if (resourceView) {
						this.pageTitle = resourceView?.type || '';
						this.loadView(resourceView);
						this.dataLoaded = true;
					}
				});
		} else {
			// Display Primary view
			this.translateService
				.get('onboardingResourceProfile.myProfile')
				.pipe(take(1))
				.subscribe(data => {
					this.pageTitle = data;
				});

			this.sharedStore.dispatch(
				getAllViewsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
			);
			this.sharedStore
				.select(selectResourceViews)
				.pipe(takeUntil(this.destroyed$))
				.subscribe(data => {
					let filteredAndSortedViews = data.views?.filter(view => view.viewType === ViewType.PRIMARY);
					filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
					this.loadView(filteredAndSortedViews[0]);
					this.dataLoaded = true;
				});

			// this.resourceService.getResourceProfileViews(this.userId).subscribe(data => {
			// 	let filteredAndSortedViews = data.views?.filter(view => view.viewType === ViewType.PRIMARY);
			// 	filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
			// 	this.loadView(filteredAndSortedViews[0]);
			// 	this.dataLoaded = true;
			// });
		}

		this.sharedStore.dispatch(getResourceInformationById({ resourceId: this.userId }));
		this.sharedStore
			.select(selectResourceDetails)
			.pipe(skip(1), takeUntil(this.destroyed$))
			.subscribe(data => {
				this.userId = data.userId;
				this.fullName = `${data.firstName} ${data.lastName}`;
			});
		// this.resourceService.getResourceInformation().subscribe(resData => {
		// 	this.userId = resData.id;
		// 	this.fullName = `${resData.firstName} ${resData.lastName}`;

		// Use viewId from route
		// const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		// if (viewId) {
		// 	this.resourceService.getViewById(viewId).subscribe(view => {
		// 		this.pageTitle = view.type;
		// 		this.loadView(view);
		// 		this.dataLoaded = true;
		// 	});
		// } else {
		// 	// Display Primary view
		// 	this.translateService
		// 		.get('onboardingResourceProfile.myProfile')
		// 		.pipe(take(1))
		// 		.subscribe(data => {
		// 			this.pageTitle = data;
		// 		});

		// 	this.resourceService.getResourceProfileViews(this.userId).subscribe(data => {
		// 		let filteredAndSortedViews = data.views?.filter(view => view.viewType === ViewType.PRIMARY);
		// 		filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
		// 		this.loadView(filteredAndSortedViews[0]);
		// 		this.dataLoaded = true;
		// 	});
		// }
		// });
	}

	loadView(view: View) {
		this.currentViewId = view.id;
		this.viewName = view.type;
		this.certifications = view.certifications;
		this.educations = view.educations;
		this.educationsSummary = view.educationsSummary;
		this.workExperiences = view.experiences;
		this.experiencesSummary = view.experiencesSummary;
		this.profileSummary = view.profileSummary;
		this.skills = view.skills.map(skill => skill.skill.name);
		this.skillsSummary = view.skillsSummary;
		this.isRejected = view.revisionType === RevisionType.REJECTED;
		this.isPendingApproval = view.revisionType === RevisionType.PENDING;
		this.rejectionComments = view.revision?.comment ? view.revision.comment : '';
		this.isPrimaryView = view.viewType === ViewType.PRIMARY;
	}

	deleteView() {
		this.translateService
			.get([`onboardingResourceProfile.deleteViewModal`])
			.pipe(take(1))
			.subscribe(data => {
				this.translateService
					.get(`onboardingResourceProfile.deleteViewModal.title`, {
						viewName: this.viewName,
					})
					.subscribe(modalTitle => {
						const dialogText = data[`onboardingResourceProfile.deleteViewModal`];
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

			this.viewsService
				.deleteView(this.currentViewId)
				.pipe(catchError(error => of(error)))
				.subscribe(error => {
					if (error) {
						this.openDeleteViewErrorModal(error.message);
					} else {
						this.modalService.confirmEventSubject.unsubscribe();
						this.translateService.get(`onboardingResourceProfile.deleteViewSuccess`).subscribe(message => {
							this.snackbar.open(message);
						});
						this.router.navigate(['../'], { relativeTo: this.route }).then(() => {
							window.location.reload();
						});
					}
				});

			this.modalService.close();
		});
	}

	openDeleteViewErrorModal(error: string) {
		this.translateService
			.get(`onboardingResourceProfile.deleteViewErrorModal.confirmText`)
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

	openEditView() {
		this.editViewEnabled = true;
	}

	closeEditView() {
		this.editViewEnabled = false;
	}

	downloadProfile() {
		// Taken from https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
		this.sharedStore.dispatch(downloadProfileByViewId({ viewId: this.currentViewId }));
		this.sharedStore
			.select(selectDownloadProfile)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				if (data) {
					const downloadURL = window.URL.createObjectURL(data);
					const link = document.createElement('a');
					link.href = downloadURL;
					// const index = this.viewIDs.indexOf(parseInt(this.currentViewID, 10));
					link.download = `${this.fullName}-${this.viewName}`;
					link.click();
				}
			});
		this.translateService
			.get(`${this.profilePrefix}downloadDialog`)
			.pipe(take(1))
			.subscribe(data => {
				this.snackbar.open(data['message']);
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
