import { ApiProperty } from '@nestjs/swagger';
import { SkillTypeEntity } from '../../..';

export class CreateSkillTypeDto {
	@ApiProperty()
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	public static toEntity(dto: CreateSkillTypeDto): SkillTypeEntity {
		if (dto == null) return new SkillTypeEntity();
		return new SkillTypeEntity(dto.name);
	}
}
