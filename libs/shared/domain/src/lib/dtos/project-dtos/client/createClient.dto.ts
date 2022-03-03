export class CreateClientDto {
	name: string;

	title: string;

	clientName: string;

	constructor(name: string, title: string, clientName: string) {
		this.name = name;
		this.title = title;
		this.clientName = clientName;
	}
}
