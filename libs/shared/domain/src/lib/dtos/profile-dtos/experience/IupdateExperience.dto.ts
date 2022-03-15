import { IUpdateLocationDto } from '../../common-dtos';
import { ICreateExperienceDto } from './IcreateExperience.dto';

export interface IUpdateExperienceDto extends Partial<Omit<ICreateExperienceDto, 'location'>> {
	id: number;

	location: IUpdateLocationDto;
}
