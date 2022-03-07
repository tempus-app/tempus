import { CreateSkillDto, Skill } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { SkillTypeEntity } from './skilltype.entity';

@Entity()
export class SkillEntity implements Skill {
	constructor(id?: number, skill?: SkillTypeEntity, level?: number, resource?: ResourceEntity) {
		this.id = id;
		this.skill = skill;
		this.level = level;
		this.resource = resource;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => SkillTypeEntity, { cascade: ['insert', 'update'] })
	@JoinColumn([{ name: 'skill_key', referencedColumnName: 'name' }])
	skill: SkillTypeEntity;

	// must be 1-5, figure it out later
	@Column()
	level: number;

	@ManyToOne(() => ResourceEntity, resource => resource.skills)
	resource: ResourceEntity;

	public static fromDto(dto: CreateSkillDto): SkillEntity {
		if (dto == null) return new SkillEntity();
		return new SkillEntity(undefined, SkillTypeEntity.fromDto(dto.skill), dto.level);
	}
}
