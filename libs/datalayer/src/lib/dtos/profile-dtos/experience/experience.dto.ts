import { Location } from '../../../models/common-models'
export class ExperienceDto {
  constructor(
    id?: number,
    title?: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    location?: Location,
  ) {}
}
