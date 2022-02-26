import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { RevisionEntity } from './revision.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from '.';
import { ResourceEntity } from '../account-entities';
import { ViewType } from '../../enums';
import { View } from '../..';

@Entity()
export class ViewEntity implements View {
  constructor(
    id?: number,
    type?: string,
    status?: RevisionEntity[],
    skills?: SkillEntity[],
    experiences?: ExperienceEntity[],
    educations?: EducationEntity[],
    resource?: ResourceEntity,
    viewType?: ViewType,
  ) {
    this.id = id;
    this.type = type;
    this.status = status;
    this.skills = skills;
    this.experiences = experiences;
    this.educations = educations;
    this.resource = resource;
    this.viewType = viewType;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => RevisionEntity, (status) => status.view)
  status: RevisionEntity[];

  @ManyToMany(() => SkillEntity)
  @JoinTable()
  skills: SkillEntity[];

  @ManyToMany(() => ExperienceEntity)
  @JoinTable()
  experiences: ExperienceEntity[];

  @ManyToMany(() => EducationEntity)
  @JoinTable()
  educations: EducationEntity[];

  @ManyToOne(() => ResourceEntity, (resource) => resource.views)
  resource: ResourceEntity;

  @Column({
    type: 'enum',
    enum: ViewType,
    default: ViewType.SECONDARY,
  })
  viewType: ViewType;
}
