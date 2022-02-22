import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EducationEntity } from '..'

@Entity()
export class LocationEntity {
  constructor(id?: number, city?: string, province?: string, country?: string) {
    this.id = id ?? null
    this.city = city ?? null
    this.province = province ?? null
    this.country = country ?? null
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  city: string

  @Column()
  province: string

  @Column()
  country: string

  @OneToOne(() => EducationEntity, (edu) => edu.location, { onDelete: 'CASCADE' })
  @JoinColumn()
  education: EducationEntity
}
