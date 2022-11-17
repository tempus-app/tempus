import jwt_decode from 'jwt-decode';
import { AbstractControl } from '@angular/forms';
import { View } from '@tempus/shared-domain';

// TODO FIGURE OUT THE USE OF 'PRSENT'
/**
 * Format date range to 'startMonth. startYear - endMonth. endYear'
 * @param  {Date} startDate
 * @param  {Date|null} endDate
 */
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

/**
 * Format date into ISO 'YYYY-MM-DD'
 * @param  {Date} date
 */
export function formatDateToISO(date: Date | null | undefined) {
	return date ? new Date(date).toISOString().split('T')[0] : null;
}

/**
 * Validate date range
 * @param  {AbstractControl} controls
 * @returns true
 */
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

/**
 * Format address into 'City, State, Country'
 * @param  {string} country
 * @param  {string} state
 * @param  {string} city
 */
export function formatAddress(country: string, state: string, city: string) {
	return `${city}, ${state}, ${country}`;
}

/**
 * Format full name into 'first, last'
 * @param  {string} first
 * @param  {string} last
 */
export function formatName(first: string, last: string) {
	return `${first} ${last}`;
}

export function decodeJwt(token: string) {
	const decodedToken: { email: string; roles: string[]; iat: number; exp: number } = jwt_decode(token || '');
	return decodedToken;
}

/**
 * Format string into bulleted array
 * @param  {string} data
 * @returns array of split items extracted from string
 */
export function splitStringIntoBulletPoints(data: string): Array<string> {
  let splitString = data.split("*");
  for(let i = 0; i < splitString.length; i++) {
    splitString[i] = splitString[i].replace(/(\r\n|\n|\r)/gm, "");
    splitString[i] = splitString[i].trim();
  }
  splitString = splitString.filter(item => item.trim() !== "");
  return splitString;
}

/**
 * Returns views sorted by last update date
 * @param {View[]} views 
 * @returns sorted views
 */
export function sortViewsByLatestUpdated(views: View[]) {
	const sortedViews = views.sort((a, b) =>
		// eslint-disable-next-line no-nested-ternary
		a.lastUpdateDate && b.lastUpdateDate
			? new Date(a.lastUpdateDate).getTime() > new Date(b.lastUpdateDate).getTime()
				? -1
				: 1
			: new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
				? -1
				: 1,
	);

	return sortedViews;
}