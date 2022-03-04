import { ResumeSectionType } from '../../../enums';

export class CreateRevisionDto {
	sectionsChanged: ResumeSectionType[];

	constructor(sectionsChanged: ResumeSectionType[]) {
		this.sectionsChanged = sectionsChanged;
	}
}
