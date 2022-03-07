export class CreateCertificationDto {
	title: string;

	institution: string;

	constructor(title: string, institution: string) {
		this.title = title;
		this.institution = institution;
	}
}
