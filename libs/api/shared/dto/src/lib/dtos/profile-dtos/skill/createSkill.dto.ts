import { ApiProperty } from '@nestjs/swagger';
import { ICreateSkillDto } from '@tempus/shared-domain';
import { CreateSkillTypeDto } from './createSkillType.dto';

export class CreateSkillDto implements ICreateSkillDto {
	@ApiProperty()
	skill: CreateSkillTypeDto;

	constructor(skill: CreateSkillTypeDto) {
		this.skill = skill;
	}
}
