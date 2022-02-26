import { ApiProperty } from '@nestjs/swagger';
import { LinkEntity } from '../../..';

export class CreateLinkDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	expiry: Date;

	constructor(firstName: string, lastName: string, email: string, expiry?: Date) {}

	public static toEntity(dto: CreateLinkDto): LinkEntity {
		if (dto == null) return new LinkEntity();
		return new LinkEntity(null, dto.firstName, dto.lastName, dto.email, dto.expiry || null, null, null);
	}
}
