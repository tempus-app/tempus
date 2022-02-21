import { LocationDto } from '../../common-dtos/location.dto'
export class ExperienceDto {
  constructor(
    id?: number,
    title?: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    location?: LocationDto,
  ) {}
}
