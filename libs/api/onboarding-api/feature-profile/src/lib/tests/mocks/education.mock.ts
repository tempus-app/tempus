import { UpdateEducationDto, UpdateLocationDto } from "@tempus/api/shared/dto";
import { EducationEntity } from "@tempus/api/shared/entity";
import { Location } from "@tempus/shared-domain";

export const educationEntity: EducationEntity = {
  id: null,
  degree: "degree",
  institution: "institution",
  startDate: new Date(1,2,3),
  endDate: new Date(1,2,3),
  location: {
    province: 'province',
    city: 'city',
    country: 'country'
  } as Location,
  resource: undefined
}

export const updateEducationDtoNullAndMissingData: UpdateEducationDto = {
  id: 3,
  location: {
    city: 'new city',
  } as UpdateLocationDto,
  institution: 'new institution'
}
