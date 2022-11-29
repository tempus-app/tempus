import { ICreateLocationDto } from '../../common-dtos';

export interface ICreateExperienceDto {
	title: string;

	description: string[];

	company: string;

	startDate?: Date;

	endDate?: Date | null;

	location: ICreateLocationDto;
}
