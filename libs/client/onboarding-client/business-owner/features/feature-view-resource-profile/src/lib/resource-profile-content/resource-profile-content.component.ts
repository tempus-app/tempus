import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	Revision,
	View,
	Skill,
} from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { ComponentChanges } from './ViewSimpleChanges';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboaringClientResourceProfileService],
})
export class ResourceProfileContentComponent implements OnInit {
	constructor(private route: ActivatedRoute, private resourceService: OnboaringClientResourceProfileService) {}

	id = '';

	@Input()
	view!: View;

	firstName = '';

	lastName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	email = '';

	phoneNumber = '';

	country = '';

	state = '';

	city = '';

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
			this.experiencesSummary = view.experiencesSummary;
			this.profileSummary = view.profileSummary;
			this.skills = view.skills.map((skill: Skill) => skill.skill.name);
			this.skillsSummary = view.skillsSummary;
			this.viewType = view.viewType;
		}
	}

	acceptChanges() {
		// IMPLEMENT
	}

	rejectChanges() {
		// IMPLEMENT
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id') || '';
		// this.resourceService.getResourceProfileViews(this.id).subscribe(profileViews => {
		// 	this.views = profileViews;
		// 	console.log(profileViews);
		// 	const primaryView = profileViews.find(view => view.viewType === 'PRIMARY');
		// 	if (primaryView) {
		// 		this.certifications = primaryView.certifications;
		// 		this.educations = primaryView.educations;
		// 		this.educationsSummary = primaryView.educationsSummary;
		// 		this.workExperiences = primaryView.experiences;
		// 		this.revision = primaryView.status;
		// 		this.viewID = primaryView.id;
		// 		this.experiencesSummary = primaryView.experiencesSummary;
		// 		this.profileSummary = primaryView.profileSummary;
		// 		this.skills = primaryView.skills.map(skill => skill.skill.name);
		// 		this.skillsSummary = primaryView.skillsSummary;
		// 		this.viewType = primaryView.viewType;
		// 	}
		// });

		this.resourceService.getResourceInformation(this.id).subscribe(resourceInfo => {
			this.firstName = resourceInfo.firstName;
			this.lastName = resourceInfo.lastName;
			this.city = resourceInfo.location.city;
			this.state = resourceInfo.location.province;
			this.country = resourceInfo.location.country;
			this.phoneNumber = resourceInfo.phoneNumber;
			this.email = resourceInfo.email;
		});
	}
}
