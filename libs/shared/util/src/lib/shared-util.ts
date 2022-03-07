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
	const endMonth = months[startDate.getMonth()];

	return `${startMonth}. ${startDate.getFullYear()} - ${endMonth}. ${endDate.getFullYear()}`;
}
