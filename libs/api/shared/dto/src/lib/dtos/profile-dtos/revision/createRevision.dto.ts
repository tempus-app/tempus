import { ApiProperty } from '@nestjs/swagger';
import { ICreateRevisionDto, ResumeSectionType } from '@tempus/shared-domain';

export class CreateRevisionDto implements ICreateRevisionDto {
	@ApiProperty()
	sectionsChanged: ResumeSectionType[];

	constructor(sectionsChanged: ResumeSectionType[]) {
		this.sectionsChanged = sectionsChanged;
	}
}
