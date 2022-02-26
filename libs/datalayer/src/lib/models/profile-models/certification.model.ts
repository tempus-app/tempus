import { Resource } from '..';

export interface Certification {
	id: number;
	title: string;
	institution: string;
	resource: Resource;
}
