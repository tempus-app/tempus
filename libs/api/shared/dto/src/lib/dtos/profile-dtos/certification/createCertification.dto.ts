import { ApiProperty } from '@nestjs/swagger';
import { ICreateCertificationDto } from '@tempus/shared-domain';

export class CreateCertificationDto implements ICreateCertificationDto {
	@ApiProperty()
	title: string;

	@ApiProperty()
	institution: string;

	constructor(title: string, institution: string) {
		this.title = title;
		this.institution = institution;
	}
}
