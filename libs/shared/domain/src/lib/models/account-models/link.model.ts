import { RoleType, StatusType } from '../../enums';
import { Project } from '../project-models';
import { User } from './user.model';

export interface Link {
	id: number;
	createdAt: Date;
	firstName: string;
	lastName: string;
	email: string;
	expiry: Date;
	token: string;
	status: StatusType;
	user?: User;
	userType: RoleType;
	project?: Project;
}
