import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SkillDto, SkillEntity, SkillTypeEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillsRepository: Repository<SkillEntity>,
  ) {}

  // create skill for a specific resource
  createSkill(resourceId: number, skill: Omit<SkillEntity, 'id'>): Promise<SkillEntity> {
    throw new NotImplementedException()

    // TODO: search for skill in skill type repository and create if doesnt exist
  }

  // return skills by resource
  findSkillsByResource(resourceId: number): Promise<SkillEntity[]> {
    throw new NotImplementedException()
  }

  findAllSkillTypes(): Promise<SkillTypeEntity[]> {
    throw new NotImplementedException()
  }

  // return skill by id
  findSkillById(skillId: number): Promise<SkillEntity> {
    throw new NotImplementedException()
  }

  // edit skill
  editSkill(skill: SkillDto): Promise<SkillEntity> {
    throw new NotImplementedException()
  }

  // delete skill
  deleteSkill(skillId: number) {
    throw new NotImplementedException()
  }
}
