import { ICreateLocationDto } from '../../common-dtos';

export interface ICreateEducationDto {
	degree: string;

	institution: string;

	startDate: Date;

	endDate: Date | null;

	location: ICreateLocationDto;
}
