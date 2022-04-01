import jwt_decode from 'jwt-decode';
import { AbstractControl } from '@angular/forms';

// TODO FIGURE OUT THE USE OF 'PRSENT'
export function formatDateRange(startDate: Date, endDate: Date | null): string {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const startMonth = months[startDate.getMonth()];
	if (endDate) {
		const endMonth = months[endDate.getMonth()];
		return `${startMonth}. ${startDate.getFullYear()} - ${endMonth}. ${endDate.getFullYear()}`;
	}

	return `${startMonth}. ${startDate.getFullYear()} - Present`;
}

export function checkEnteredDates() {
	return (controls: AbstractControl) => {
		if (controls) {
			const formStartDate = controls.get('startDate')?.value;
			const formEndDate = controls.get('endDate')?.value;
			if (formStartDate > formEndDate && formEndDate !== '') {
				// this is the returned error to display the mat error
				return { dateError: true };
			}
		}
		return null;
	};
}

export function formatAddress(country: string, state: string, city: string) {
	return `${city}, ${state}, ${country}`;
}

export function formatName(first: string, last: string) {
	return `${first} ${last}`;
}

export function decodeJwt(token: string) {
	const decodedToken: { email: string; roles: string[]; iat: number; exp: number } = jwt_decode(token || '');
	return decodedToken;
}
