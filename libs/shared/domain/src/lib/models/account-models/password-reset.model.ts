import { User } from '..';
import { PasswordResetStatus } from '../../enums';

export interface PasswordReset {
	id: number;
	user: User;
	token: string;
	status: PasswordResetStatus;
	expiry: Date;
}

// User clicks forget password
// API request sent to /forgot-password/user id
// create reset entity with the resource & the new token, status: VALID
// API request sentt to /reset-password w/ new password and resource id (& link)
// checks link and then saves new password with bycrypt if valid link and not expired, status: INVALID (already used)s
