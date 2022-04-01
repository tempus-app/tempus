import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	Revision,
	View,
	Skill,
} from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ActivatedRoute } from '@angular/router';
import { ComponentChanges } from './ViewSimpleChanges';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboaringClientResourceProfileService],
})
export class ResourceProfileContentComponent {
	constructor(
		private route: ActivatedRoute,
		public modalService: ModalService,
		private resourceService: OnboaringClientResourceProfileService,
	) {}

	id = '';

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

	viewID = 0;

	isRevision = false;

	resume: File | null = null;

	@Output() revisionViewLoaded = new EventEmitter<boolean>();

	ngOnInit(): void {
		const viewID = this.route.snapshot.paramMap.get('viewID') || '';
		this.resourceService.getView(viewID).subscribe(revisionView => {
			// if (revisionView.revision) {
			if (revisionView.status) {
				// const revisedView = revisionView.revision.newView;
				const revisedView = revisionView;
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
				this.revisionViewLoaded.emit(true);
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
		});
	}

	openRejectionDialog() {
		this.modalService.open(
			{ title: 'Enter Comments', closeText: 'CANCEL', confirmText: 'SUBMIT', closable: true, template: this.template },
			CustomModalType.CONTENT,
		);
		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	openConfirmationDialog() {
		this.modalService.open(
			{
				title: 'Revision Approved!',
				confirmText: 'CLOSE',
				message: 'You have approved the revision',
				modalType: ModalType.INFO,
				closable: true,
			},
			CustomModalType.INFO,
		);
		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}
}
