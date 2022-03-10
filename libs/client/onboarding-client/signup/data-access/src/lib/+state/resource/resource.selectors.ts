import { createSelector } from '@ngrx/store';

import { SignupState } from '../signup.state';
import { ResourceState } from './resource.reducers';

export const selectResource = (state: SignupState) => state.resource;
export const selectResourceData = createSelector(selectResource, (state: ResourceState) => state.createResourceData);
