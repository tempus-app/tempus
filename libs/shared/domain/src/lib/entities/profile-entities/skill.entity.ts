import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Skill } from '../..';
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

	@ManyToOne(() => ResourceEntity, resource => resource.skills)
	resource: ResourceEntity;
}
