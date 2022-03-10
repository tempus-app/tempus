import { createAction, props } from '@ngrx/store';
import { Link } from '@tempus/shared-domain';

export const loadLinkData = createAction('[Signup Credentials Page] Load Link Data', props<{ linkId: string }>());

export const loadLinkDataSucess = createAction(
	'[Onboarding Client Link API] Load Link Data Success',
	props<{ link: Link }>(),
);

export const loadLinkDataFailure = createAction(
	'[Onboarding Client Link API] Load Link Data Failure',
	props<{ error: string }>(),
);
