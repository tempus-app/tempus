import { Resource } from '..';

export interface Certification {
	id: number;
	title: string;
	institution: string;
	summary: string;
	resource: Resource;
}
