import { Certification } from '.';
import { ViewType } from '../..';
import { RevisionType, RoleType } from '../../enums';
import { Resource } from '../account-models';
import { Education } from './education.model';
import { Experience } from './experience.model';
import { Revision } from './revision.model';
import { Skill } from './skill.model';

export interface View {
	id: number;
	profileSummary: string;
	skillsSummary: string;
	educationsSummary: string;
	experiencesSummary: string;
	type: string;
	revision?: Revision;
	locked: boolean;
	skills: Skill[];
	experiences: Experience[];
	educations: Education[];
	certifications: Certification[];
	resource: Resource;
	viewType: ViewType;
	revisionType?: RevisionType;
	createdBy: RoleType;
	lastUpdateDate?: Date;
	updatedBy?: RoleType;
}
