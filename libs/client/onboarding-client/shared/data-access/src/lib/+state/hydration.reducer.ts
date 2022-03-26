import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { SessionStorageKey } from '../enum';
import { OnboardingClientState } from './onboardingClient.state';

export const hydrationMetaReducer = (
	reducer: ActionReducer<OnboardingClientState>,
): ActionReducer<OnboardingClientState> => {
	return (state, action) => {
		let newState = { ...state };
		if (action.type === INIT || action.type === UPDATE || action.type === '@ngrx/router-store/navigated') {
			const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
			const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
			const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
			const roles: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ROLES);
			const rolesArr = roles ? JSON.parse(roles) : [];
			if (newState.auth) {
				newState = {
					...newState,
					auth: { ...newState.auth, accessToken, loggedInUserId: userId, userRoles: rolesArr },
				};
			}
			return reducer(newState as OnboardingClientState, action);
		}
		return reducer(state, action);
	};
};
