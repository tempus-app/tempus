import { CreateSkillDto } from '@tempus/api/shared/dto';
import { Skill } from '@tempus/shared-domain';
import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { SkillTypeEntity } from './skilltype.entity';

@Entity()
export class SkillEntity implements Skill {
	constructor(id?: number, skill?: SkillTypeEntity, resource?: ResourceEntity) {
		this.id = id;
		this.skill = skill;
		this.resource = resource;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => SkillTypeEntity, { cascade: ['insert', 'update'] })
	@JoinColumn([{ name: 'skill_key', referencedColumnName: 'name' }])
	skill: SkillTypeEntity;

	@ManyToOne(() => ResourceEntity, resource => resource.skills, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	public static fromDto(dto: CreateSkillDto): SkillEntity {
		if (dto == null) return new SkillEntity();
		return new SkillEntity(undefined, SkillTypeEntity.fromDto(dto.skill));
	}
}
