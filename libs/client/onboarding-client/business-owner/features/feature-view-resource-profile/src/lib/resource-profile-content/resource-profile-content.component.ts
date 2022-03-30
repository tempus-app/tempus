import { Component } from '@angular/core';
import { ICreateCertificationDto, ICreateEducationDto, ICreateExperienceDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
})
export class ResourceProfileContentComponent {
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

	resume: File | null = null;
}
