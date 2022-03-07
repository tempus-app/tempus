import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillTypeDto {
	@ApiProperty()
	name: string;

	constructor(name: string) {
		this.name = name;
	}
}
