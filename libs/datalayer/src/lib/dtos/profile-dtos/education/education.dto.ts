import { Location } from '../../../models/common-models'
export class EducationDto {
  constructor(
    id?: number,
    degree?: string,
    institution?: string,
    startDate?: Date,
    endDate?: Date,
    location?: Location,
  ) {}
}
