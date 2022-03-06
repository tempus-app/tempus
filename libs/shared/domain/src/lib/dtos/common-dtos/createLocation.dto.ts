import { ApiProperty } from '@nestjs/swagger';
import { LocationEntity } from '../..';

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

	public static toEntity(dto: CreateLocationDto): LocationEntity {
		if (dto == null) return new LocationEntity();
		return new LocationEntity(undefined, dto.city, dto.province, dto.city);
	}
}
