import { User } from './user.model';
import { Certification, Education, Experience, Skill, View } from '../profile-models';
import { Location } from '../common-models';
import { Project } from '../project-models';

export interface Resource extends User {
  phoneNumber: string;
  location: Location;
  title: string;
  projects: Project[];
  views: View[];
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
}
