import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SkillEntity, SkillTypeEntity } from '../entities'
import { Skill } from '../models/skill.model'

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillsRepository: Repository<SkillEntity>,
    private skillTypeRepository: Repository<SkillTypeEntity>,
  ) {}

  // create skill for a specific resource
  createSkill(resourceId: number, skill: Omit<SkillEntity, 'id'>): Promise<SkillEntity> {
    throw new NotImplementedException()

    // TODO: search for skill in skill type repository and create if doesnt exist
  }

  // return skills by resource
  findSkillsByResource(resourceId: number) {
    throw new NotImplementedException()
  }

  // return skill by id
  findSkillsById(skillId: number) {
    throw new NotImplementedException()
  }

  // edit skill
  editSkill(skill: Skill) {
    throw new NotImplementedException()
  }

  // delete skill
  deleteView(skillId: string) {
    throw new NotImplementedException()
  }
}
