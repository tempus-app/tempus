import { ViewNames } from './viewNames.model';

export interface LoadView {
	isRevision: boolean;
	currentViewName?: string;
	resourceViews?: ViewNames[];
}
