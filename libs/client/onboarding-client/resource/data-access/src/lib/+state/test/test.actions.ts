import { createAction, props } from '@ngrx/store';

export const test = createAction('[Onboarding Client Profile Page] Test', props<{ test: string }>());
export const testSuccess = createAction('[Onboarding Client Profile Page] Test Success');
export const testFailure = createAction('[Onboarding Client Profile Page] Test Failure', props<{ error: Error }>());
