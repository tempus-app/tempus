import { ApiProperty } from '@nestjs/swagger';
import { CreateSkillTypeDto } from './createSkillType.dto';

export class CreateSkillDto {
	@ApiProperty()
	skill: CreateSkillTypeDto;

	@ApiProperty()
	level: number;

	constructor(skill: CreateSkillTypeDto, level: number) {
		this.skill = skill;
		this.level = level;
	}
}
