import { ICreateUserDto } from './IcreateUser.dto';

export interface IUpdateUserDto extends Partial<ICreateUserDto> {
	id: number;
}
