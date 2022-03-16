import { ApiProperty } from '@nestjs/swagger';
import { ICreateLocationDto } from '@tempus/shared-domain';

export class CreateLocationDto implements ICreateLocationDto {
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
