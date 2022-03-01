import { ApiProperty } from '@nestjs/swagger';
import { Certification, Education, Experience, Skill } from '../../models';

export class ResumeComponentsDto {
	@ApiProperty()
	educations: Education[];

	@ApiProperty()
	experiences: Experience[];

	@ApiProperty()
	skills: Skill[];

	@ApiProperty()
	certifications: Certification[];

	constructor(educations: Education[], experiences: Experience[], skills: Skill[], certifications: Certification[]) {
		this.educations = educations;
		this.experiences = experiences;
		this.certifications = certifications;
		this.skills = skills;
	}
}
