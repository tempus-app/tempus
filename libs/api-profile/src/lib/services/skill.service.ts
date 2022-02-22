import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimSkillDto, SkillEntity, SkillTypeEntity, FullSkillDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class SkillsService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(SkillEntity)
    private skillsRepository: Repository<SkillEntity>,
  ) {}

  // create skill for a specific resource
  async createSkill(resourceId: number, skill: SlimSkillDto): Promise<FullSkillDto> {
    let skillEntity = SlimSkillDto.toEntity(skill)
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    skillEntity.resource = resourceEntity
    skillEntity = await this.skillsRepository.save(skillEntity)

    return FullSkillDto.fromEntity(skillEntity)

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
  editSkill(skill: SlimSkillDto): Promise<SkillEntity> {
    throw new NotImplementedException()
  }

  // delete skill
  deleteSkill(skillId: number) {
    throw new NotImplementedException()
  }
}
