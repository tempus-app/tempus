export class CreateProjectDto {
	name: string;

	startDate: Date;

	endDate: Date;

	hoursPerDay: number;

	constructor(name: string, startDate: Date, endDate: Date, hoursPerDay: number) {
		this.endDate = endDate;
		this.name = name;
		this.startDate = startDate;
		this.hoursPerDay = hoursPerDay;
	}
}
