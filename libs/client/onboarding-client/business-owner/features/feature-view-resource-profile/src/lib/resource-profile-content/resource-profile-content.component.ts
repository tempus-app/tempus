import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	Revision,
	View,
	Skill,
} from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ComponentChanges } from './ViewSimpleChanges';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboaringClientResourceProfileService],
})
export class ResourceProfileContentComponent implements OnChanges {
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

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	viewType = '';

	viewID = 0;

	revision: Revision[] | undefined;

	resume: File | null = null;

	ngOnChanges(changes: ComponentChanges<ResourceProfileContentComponent>): void {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		const view = changes.view?.currentValue;
		if (view) {
			this.certifications = view.certifications;
			this.educations = view.educations;
			this.educationsSummary = view.educationsSummary;
			this.workExperiences = view.experiences;
			this.revision = view.status;
			this.experiencesSummary = view.experiencesSummary;
			this.profileSummary = view.profileSummary;
			this.skills = view.skills.map((skill: Skill) => skill.skill.name);
			this.skillsSummary = view.skillsSummary;
			this.viewType = view.viewType;
		}
	}

	acceptChanges() {
		// TODO: IMPLEMENT
	}

	rejectChanges() {
		// TODO: IMPLEMENT
	}
}
