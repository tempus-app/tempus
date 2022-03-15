import { ICreateCertificationDto } from './IcreateCertification.dto';

export interface IUpdateCertificationDto extends Partial<ICreateCertificationDto> {
	id: number;
}
