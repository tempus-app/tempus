import { User } from '..';
import { View } from './view.model';

export interface Revision {
	id: number;
	createdAt: Date;
	approvedAt?: Date;
	approver: User;
	approved?: boolean;
	view: View;
	newView: View;
}
