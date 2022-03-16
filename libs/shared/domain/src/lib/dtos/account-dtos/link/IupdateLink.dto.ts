import { StatusType } from '../../../enums';
import { ICreateLinkDto } from './IcreateLink.dto';

export interface IUpdateLinkDto extends Partial<ICreateLinkDto> {
	id: number;

	status: StatusType;
}
