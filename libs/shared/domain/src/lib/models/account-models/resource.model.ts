import { User } from './user.model';
import { Certification, Education, Experience, Skill, View } from '../profile-models';
import { Location } from '../common-models';
import { ProjectResource } from '../project-models';

export interface Resource extends User {
	phoneNumber: string;
	calEmail: string;
	location: Location;
	title: string;
	projectResources: ProjectResource[];
	views: View[];
	experiences: Experience[];
	educations: Education[];
	skills: Skill[];
	certifications: Certification[];
	linkedInLink: string;
	githubLink: string;
	otherLink: string;
	resume: Uint8Array;
}
