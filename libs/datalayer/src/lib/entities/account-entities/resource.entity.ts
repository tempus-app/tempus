import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Resource, RoleType } from '../..';
import { LocationEntity } from '../common-entities';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity, ViewEntity } from '../profile-entities';
import { ProjectEntity } from '../project-entities';
import { UserEntity } from './user.entity';

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
  constructor(
    id?: number,
    phoneNumber?: string,
    title?: string,
    location?: LocationEntity,
    projects?: ProjectEntity[],
    views?: ViewEntity[],
    experiences?: ExperienceEntity[],
    educations?: EducationEntity[],
    skills?: SkillEntity[],
    certifications?: CertificationEntity[],
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    super(id, firstName, lastName, email, password, roles);
    this.phoneNumber = phoneNumber;
    this.title = title;
    this.location = location;
    this.projects = projects;
    this.views = views;
    this.experiences = experiences;
    this.educations = educations;
    this.skills = skills;
    this.certifications = certifications;
  }

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  title: string;

  @OneToOne(() => LocationEntity, (loc) => loc.resource, { cascade: ['insert', 'update'] })
  location: LocationEntity;

  @ManyToMany(() => ProjectEntity, { cascade: ['insert', 'update'] })
  @JoinTable()
  projects: ProjectEntity[];

  @OneToMany(() => ViewEntity, (views) => views.resource, { cascade: ['insert', 'update'] })
  views: ViewEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.resource, { cascade: ['insert', 'update'] })
  experiences: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (education) => education.resource, { cascade: ['insert', 'update'] })
  educations: EducationEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.resource, { cascade: ['insert', 'update'] })
  skills: SkillEntity[];

  @OneToMany(() => CertificationEntity, (certification) => certification.resource, { cascade: ['insert', 'update'] })
  certifications: CertificationEntity[];
}
