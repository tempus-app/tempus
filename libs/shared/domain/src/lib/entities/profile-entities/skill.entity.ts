import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Skill } from '../..';
import { ResourceEntity } from '../account-entities';
import { SkillTypeEntity } from './skilltype.entity';

@Entity()
export class SkillEntity implements Skill {
	constructor(id?: number, skill?: SkillTypeEntity, level?: number, resource?: ResourceEntity) {
		this.id = id || 0;
		this.skill = skill || new SkillTypeEntity();
		this.level = level || 0;
		this.resource = resource || new ResourceEntity();
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
}
