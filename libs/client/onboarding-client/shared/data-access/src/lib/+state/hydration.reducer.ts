import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { RoleType } from '@tempus/shared-domain';
import { SessionStorageKey } from '../enum';
import { OnboardingClientState } from './onboardingClient.state';

export const hydrationMetaReducer = (
	reducer: ActionReducer<OnboardingClientState>,
): ActionReducer<OnboardingClientState> => {
	return (state, action) => {
		let newState = { ...state };
		if (action.type === INIT || action.type === UPDATE || action.type === '@ngrx/router-store/navigated') {
			const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
			const refreshToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN);
			const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
			const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
			const firstName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_FIRST_NAME);
			const lastName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_LAST_NAME);
			const email: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_EMAIL);
      const rolesString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ROLES);
      let roles: RoleType[] = [];
      if (rolesString) {
        roles = JSON.parse(rolesString);
      }

			if (newState.auth) {
				newState = {
					...newState,
					auth: { ...newState.auth, accessToken, refreshToken, loggedInUserId: userId, firstName, lastName, email, roles },
				};
			}
			return reducer(newState as OnboardingClientState, action);
		}
		return reducer(state, action);
	};
};
