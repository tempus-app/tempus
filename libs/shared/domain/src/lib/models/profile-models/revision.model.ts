import { View } from './view.model';

export interface Revision {
	id: number;
	createdAt: Date;
	approved?: boolean;
	views: View[];
	comment: string;
}
