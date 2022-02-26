import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Skill } from '../..';
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

  @ManyToOne(() => SkillTypeEntity)
  @JoinColumn([{ name: 'skill_key', referencedColumnName: 'name' }])
  skill: SkillTypeEntity;

  // must be 1-5, figure it out later
  @Column()
  level: number;

  @ManyToOne(() => ResourceEntity, (resource) => resource.skills)
  resource: ResourceEntity;
}
