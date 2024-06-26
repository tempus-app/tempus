/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	OnboardingClientViewsService,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { catchError, of, Subject, take, takeUntil } from 'rxjs';
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
	TempusResourceState,
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
		private resourceService: OnboardingClientResourceService,
		private viewsService: OnboardingClientViewsService,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private resourceStore: Store<TempusResourceState>,
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
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
			});

		this.resourceStore.dispatch(getResourceOriginalResumeById({ resourceId: this.userId }));

		this.resourceStore
			.select(selectResourceOriginalResume)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});

		this.resourceStore.dispatch(
			getAllViewsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.fullName = `${resData.firstName} ${resData.lastName}`;

			// Use viewId from route
			const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
			if (viewId) {
				this.resourceService.getViewById(viewId).subscribe(view => {
					this.pageTitle = view.type;
					this.loadView(view);
					this.dataLoaded = true;
				});
			} else {
				// Display Primary view
				this.translateService
					.get('onboardingResourceProfile.myProfile')
					.pipe(take(1))
					.subscribe(data => {
						this.pageTitle = data;
					});

				this.resourceService.getResourceProfileViews(this.userId).subscribe(data => {
					let filteredAndSortedViews = data.views?.filter(view => view.viewType === ViewType.PRIMARY);
					filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
					this.loadView(filteredAndSortedViews[0]);
					this.dataLoaded = true;
				});
			}
		});
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
		this.resourceStore
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
