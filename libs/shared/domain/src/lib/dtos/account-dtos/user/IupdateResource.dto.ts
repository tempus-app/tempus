import { ICreateResourceDto } from './IcreateResource.dto';

export interface IUpdateResourceDto extends Partial<ICreateResourceDto> {
	id: number;
}
