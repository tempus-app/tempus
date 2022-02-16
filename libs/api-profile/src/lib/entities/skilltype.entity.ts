import {
Entity,
Column,
Unique,
PrimaryColumn,
} from 'typeorm'

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillTypeEntity {
    @Column({ unique: true })
    @PrimaryColumn()
    name: string
}
