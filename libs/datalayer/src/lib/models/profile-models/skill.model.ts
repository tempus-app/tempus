import { Resource } from '..'
import { SkillType } from './skilltype.model'

export interface Skill {
  id: number

  skill: SkillType

  level: number

  resource: Resource
}
