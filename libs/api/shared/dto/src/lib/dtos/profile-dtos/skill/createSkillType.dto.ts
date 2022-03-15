import { ApiProperty } from '@nestjs/swagger';
import { ICreateSkillTypeDto } from '@tempus/shared-domain';

export class CreateSkillTypeDto implements ICreateSkillTypeDto {
	@ApiProperty()
	name: string;

	constructor(name: string) {
		this.name = name;
	}
}
