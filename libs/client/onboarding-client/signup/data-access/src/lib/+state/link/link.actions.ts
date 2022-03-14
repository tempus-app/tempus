import { createAction, props } from '@ngrx/store';
import { Link } from '@tempus/shared-domain';

export const loadLinkData = createAction('[Signup Credentials Page] Load Link Data', props<{ linkToken: string }>());

export const loadLinkDataSucess = createAction(
	'[Onboarding Client Link API] Load Link Data Success',
	props<{ link: Link }>(),
);

export const loadLinkDataFailure = createAction(
	'[Onboarding Client Link API] Load Link Data Failure',
	props<{ error: string }>(),
);

export const resetLinkState = createAction('[Signup Review Page] Reset Link State');
