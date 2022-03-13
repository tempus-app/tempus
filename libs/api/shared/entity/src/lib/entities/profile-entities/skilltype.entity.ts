import { CreateSkillTypeDto } from '@tempus/api/shared/dto';
import { SkillType } from '@tempus/shared-domain';

import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillTypeEntity implements SkillType {
	constructor(name?: string) {
		this.name = name;
	}

	@Column({ unique: true })
	@PrimaryColumn()
	name: string;

	public static fromDto(dto: CreateSkillTypeDto): SkillTypeEntity {
		if (dto == null) return new SkillTypeEntity();
		return new SkillTypeEntity(dto.name);
	}
}
