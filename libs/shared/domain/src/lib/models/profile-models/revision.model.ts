import { View } from './view.model';

export interface Revision {
	id: number;
	createdAt: Date;
	approved?: boolean;
	view: View;
	newView: View;
	comment: string;
}
