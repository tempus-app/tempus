import { Component, OnInit } from '@angular/core';
import { ICreateCertificationDto, ICreateEducationDto, ICreateExperienceDto, View } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboaringClientResourceProfileService],
})
export class ResourceProfileContentComponent implements OnInit {
	constructor(private resourceService: OnboaringClientResourceProfileService) {}

	views: View[] = [];

	firstName = 'Sample';

	lastName = 'Person';

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

	resume: File | null = null;

	ngOnInit(): void {
		this.resourceService.getResourceProfileViews(1).subscribe(profileViews => {
			this.views = profileViews;
			const primaryView = profileViews.find(view => view.viewType === 'PRIMARY');
			if (primaryView) {
				this.certifications = primaryView.certifications;
				this.educations = primaryView.educations;
				this.educationsSummary = primaryView.educationsSummary;
				this.workExperiences = primaryView.experiences;
				this.experiencesSummary = primaryView.experiencesSummary;
				this.profileSummary = primaryView.profileSummary;
				this.skills = primaryView.skills.map(skill => skill.skill.name);
				this.skillsSummary = primaryView.skillsSummary;
				this.viewType = primaryView.viewType;
			}
		});

		this.resourceService.getResourceInformation(1).subscribe(resourceInfo => {
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
