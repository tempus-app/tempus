import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Education } from '../../models';
import { ResourceEntity } from '../account-entities';
import { LocationEntity } from '../common-entities';

@Entity()
export class EducationEntity implements Education {
  constructor(
    id?: number,
    degree?: string,
    institution?: string,
    startDate?: Date,
    endDate?: Date,
    location?: LocationEntity,
    resource?: ResourceEntity,
  ) {
    this.id = id;
    this.degree = degree;
    this.institution = institution;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.resource = resource;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  degree: string;

  @Column()
  institution: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToOne(() => LocationEntity, (location) => location.education, {
    cascade: ['insert', 'update'],
  })
  location: LocationEntity;

  @ManyToOne(() => ResourceEntity, (resource) => resource.educations, {
    onDelete: 'CASCADE',
  })
  resource: ResourceEntity;
}
