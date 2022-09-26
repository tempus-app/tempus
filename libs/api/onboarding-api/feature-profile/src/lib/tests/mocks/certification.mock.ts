import { UpdateCertificationDto } from "@tempus/api/shared/dto";
import { CertificationEntity } from "@tempus/api/shared/entity";

export const certificationEntity: CertificationEntity = {
  id: null,
  title: "title",
  institution: "institution",
  summary: "summary",
  resource: undefined
}

export const updateCertificationDtoNullAndMissingData: UpdateCertificationDto = {
  id: 3,
  title: 'new title',
  summary: null
}