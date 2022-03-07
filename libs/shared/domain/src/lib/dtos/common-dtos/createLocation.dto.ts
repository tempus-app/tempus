import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
	@ApiProperty()
	city: string;

	@ApiProperty()
	province: string;

	@ApiProperty()
	country: string;

	constructor(city: string, province: string, country: string) {
		this.city = city;
		this.province = province;
		this.country = country;
	}
}
