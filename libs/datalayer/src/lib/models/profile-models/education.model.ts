import { Resource } from '../account-models';
import { Location } from '../common-models';

export interface Education {
  id: number;
  degree: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  location: Location;
  resource: Resource;
}
