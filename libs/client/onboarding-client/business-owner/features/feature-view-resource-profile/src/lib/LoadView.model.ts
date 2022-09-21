import { ViewNames } from '@tempus/shared-domain';

export interface LoadView {
	isRevision: boolean;
	currentViewName?: string;
	resourceViews?: ViewNames[];
}
