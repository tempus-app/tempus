import { ApiProperty } from '@nestjs/swagger';
import { CreateSkillTypeDto } from './createSkillType.dto';

export class CreateSkillDto {
	@ApiProperty()
	skill: CreateSkillTypeDto;

	constructor(skill: CreateSkillTypeDto) {
		this.skill = skill;
	}
}
