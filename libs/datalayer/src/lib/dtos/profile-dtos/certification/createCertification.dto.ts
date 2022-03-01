import { CertificationEntity } from '../../..';

export class CreateCertificationDto {
	title: string;

	institution: string;

	constructor(title: string, institution: string) {
		this.title = title;
		this.institution = institution;
	}

	public static toEntity(dto: CreateCertificationDto): CertificationEntity {
		if (dto == null) return new CertificationEntity();
		return new CertificationEntity(null, dto.title, dto.institution);
	}
}
