import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { SessionStorageKey } from '@tempus/client/onboarding-client/shared/data-access';
import { ProfileState } from './profile.state';

export const hydrationMetaReducer = (reducer: ActionReducer<ProfileState>): ActionReducer<ProfileState> => {
	return (state, action) => {
		let newState = { ...state };
		if (action.type === INIT || action.type === UPDATE || action.type === '@ngrx/router-store/navigated') {
			const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
			const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
			const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
			if (newState.auth) {
				newState = { ...newState, auth: { ...newState.auth, accessToken, loggedInUserId: userId } };
			}
			return reducer(newState as ProfileState, action);
		}
		return reducer(state, action);
	};
};
