import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ICreateCertificationDto, ICreateEducationDto, ICreateExperienceDto, View, Skill } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { LoadView } from '../LoadView.model';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboaringClientResourceProfileService],
})
export class ResourceProfileContentComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public modalService: ModalService,
		private resourceService: OnboaringClientResourceProfileService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@Input()
	view!: View;

	@Input()
	firstName = '';

	@Input()
	lastName = '';

	@Input()
	email = '';

	@Input()
	phoneNumber = '';

	@Input()
	country = '';

	@Input()
	state = '';

	@Input()
	city = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	@ViewChild('modalID')
	template!: TemplateRef<unknown>;

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	viewType = '';

	viewID = '';

	isRevision = false;

	resume: File | null = null;

	viewResourceProfilePrefx = 'viewResourceProfile.';

	viewResourceProfileForm = this.fb.group({
		rejectionComments: [''],
	});

	@Output() revisionViewLoaded = new EventEmitter<LoadView>();

	ngOnInit(): void {
		this.viewID = this.route.snapshot.paramMap.get('viewID') || '';
		this.resourceService.getView(this.viewID).subscribe(revisionView => {
			if (revisionView.revision) {
				const revisedView = revisionView.revision.newView;
				this.certifications = revisedView.certifications;
				this.educations = revisedView.educations;
				this.educationsSummary = revisedView.educationsSummary;
				this.workExperiences = revisedView.experiences;
				this.experiencesSummary = revisedView.experiencesSummary;
				this.profileSummary = revisedView.profileSummary;
				this.skills = revisedView.skills.map((skill: Skill) => skill.skill.name);
				this.skillsSummary = revisedView.skillsSummary;
				this.viewType = revisedView.viewType;
				this.isRevision = true;
			} else {
				this.certifications = revisionView.certifications;
				this.educations = revisionView.educations;
				this.educationsSummary = revisionView.educationsSummary;
				this.workExperiences = revisionView.experiences;
				this.experiencesSummary = revisionView.experiencesSummary;
				this.profileSummary = revisionView.profileSummary;
				this.skills = revisionView.skills.map((skill: Skill) => skill.skill.name);
				this.skillsSummary = revisionView.skillsSummary;
				this.viewType = revisionView.viewType;
			}
			this.isRevision = true;
			this.revisionViewLoaded.emit({ isRevision: this.isRevision, viewName: revisionView.type });
		});
	}

	openRejectionDialog() {
		this.translateService
			.get(['viewResourceProfile.rejectDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const rejectionDialogText = data['viewResourceProfile.rejectDialog'];
				this.modalService.open(
					{
						title: rejectionDialogText.title,
						closeText: rejectionDialogText.closeText,
						confirmText: rejectionDialogText.confirmText,
						closable: true,
						template: this.template,
					},
					CustomModalType.CONTENT,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.resourceService
				.approveOrDenyRevision(
					this.viewID,
					// eslint-disable-next-line @typescript-eslint/dot-notation
					this.viewResourceProfileForm.controls['rejectionComments'].value,
					false,
				)
				.subscribe();
			this.modalService.confirmEventSubject.unsubscribe();
			this.router.navigate(['../../../manage-resources'], { relativeTo: this.route });
		});
	}

	openConfirmationDialog() {
		this.translateService
			.get(['viewResourceProfile.confirmationDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const confirmationDialogText = data['viewResourceProfile.confirmationDialog'];
				this.modalService.open(
					{
						title: confirmationDialogText.title,
						confirmText: confirmationDialogText.confirmText,
						message: confirmationDialogText.message,
						modalType: ModalType.INFO,
						closable: true,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.resourceService.approveOrDenyRevision(this.viewID, '', true).subscribe();
			this.modalService.confirmEventSubject.unsubscribe();
			this.router.navigate(['../../../manage-resources'], { relativeTo: this.route });
		});
	}
}
