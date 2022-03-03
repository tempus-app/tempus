import { ApiProperty } from '@nestjs/swagger';
import { SkillEntity } from '../../..';
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

	public static toEntity(dto: CreateSkillDto): SkillEntity {
		if (dto == null) return new SkillEntity();
		return new SkillEntity(null, CreateSkillTypeDto.toEntity(dto.skill), dto.level);
	}
}
