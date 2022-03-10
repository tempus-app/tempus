import { createSelector } from '@ngrx/store';

import { SignupState } from '../signup.state';
import { LinkState } from './link.reducers';

export const selectLink = (state: SignupState) => state.link;
export const selectLinkData = createSelector(selectLink, (state: LinkState) => state.link);
