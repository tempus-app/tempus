import { Certification, Education, Experience, Skill } from '@tempus/shared-domain';

export class ResumeComponentsDto {
	educations: Education[];

	experiences: Experience[];

	skills: Skill[];

	certifications: Certification[];

	constructor(educations: Education[], experiences: Experience[], skills: Skill[], certifications: Certification[]) {
		this.educations = educations;
		this.experiences = experiences;
		this.certifications = certifications;
		this.skills = skills;
	}
}
