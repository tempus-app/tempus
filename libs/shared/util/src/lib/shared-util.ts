import { AbstractControl } from '@angular/forms';

export function formatDateRange(startDate: Date, endDate: Date): string {
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
	const endMonth = months[endDate.getMonth()];

	return `${startMonth}. ${startDate.getFullYear()} - ${endMonth}. ${endDate.getFullYear()}`;
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
