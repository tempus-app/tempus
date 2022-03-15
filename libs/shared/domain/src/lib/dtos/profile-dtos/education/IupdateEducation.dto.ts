import { IUpdateLocationDto } from '../../common-dtos';
import { ICreateEducationDto } from './IcreateEducation.dto';

export interface IUpdateEducationDto extends Partial<Omit<ICreateEducationDto, 'location'>> {
	id: number;

	location: IUpdateLocationDto;
}
