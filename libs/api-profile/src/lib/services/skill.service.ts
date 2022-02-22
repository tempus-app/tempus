import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimSkillDto, SkillEntity, SkillTypeEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class SkillsService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(SkillEntity)
    private skillsRepository: Repository<SkillEntity>,
    @InjectRepository(SkillTypeEntity)
    private skillTypeRepository: Repository<SkillTypeEntity>,
  ) {}

  // create skill for a specific resource
  async createSkill(resourceId: number, skillData: SkillEntity): Promise<SkillEntity> {
    let skillEntity = SlimSkillDto.toEntity(skillData)
    let skillTypeEntity = await this.skillTypeRepository.findOne(skillData.skill.name)

    if (!skillTypeEntity) {
      skillTypeEntity = new SkillTypeEntity(skillData.skill.name)
    }
    skillEntity.skill = skillTypeEntity

    let resourceEntity = await this.resourceService.findResourceById(resourceId)
    skillEntity.resource = resourceEntity

    skillEntity = await this.skillsRepository.save(skillEntity)

    return skillEntity
  }

  // return skills by resource
  async findSkillsByResource(resourceId: number): Promise<SkillEntity[]> {
    let skillEntities = await this.skillsRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'skill'],
    })
    return skillEntities
  }

  async findAllSkillTypes(): Promise<SkillTypeEntity[]> {
    let skillTypeEntities = await this.skillTypeRepository.find()
    return skillTypeEntities
  }

  // return skill by id
  async findSkillById(skillId: number): Promise<SkillEntity> {
    let skillEntity = await this.skillsRepository.findOne(skillId, { relations: ['resource', 'skill'] })
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skillId}`)
    }
    return skillEntity
  }

  // edit skill -- NEED REWORKING
  async editSkill(skill: SkillEntity): Promise<SkillEntity> {
    let skillEntity = await this.skillsRepository.findOne(skill.id)
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skill.id}`)
    }
    await this.skillsRepository.update(skill.id, skill)
    let updatedEntity = await this.skillsRepository.findOne(skill.id, { relations: ['resource', 'skill'] })
    return updatedEntity
  }

  // delete skill
  async deleteSkill(skillId: number) {
    let skillEntity = await this.skillsRepository.findOne(skillId)
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skillId}`)
    }
    this.skillsRepository.delete(skillEntity)
  }
}
