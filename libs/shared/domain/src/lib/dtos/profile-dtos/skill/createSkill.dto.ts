import { ApiProperty } from '@nestjs/swagger';
import { SkillEntity } from '../../..';
import { CreateSkillTypeDto } from './createSkillType.dto';

export class CreateSkillDto {
	@ApiProperty()
	skill: CreateSkillTypeDto;

	constructor(skill: CreateSkillTypeDto) {
		this.skill = skill;
	}

	public static toEntity(dto: CreateSkillDto): SkillEntity {
		if (dto == null) return new SkillEntity();
		return new SkillEntity(null, CreateSkillTypeDto.toEntity(dto.skill));
	}
}
