import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimSkillDto, SkillEntity, SkillTypeEntity, FullResourceDto } from '@tempus/datalayer'
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
      await this.skillTypeRepository.save(skillTypeEntity)
    }
    skillEntity.skill = skillTypeEntity

    let resource = await this.resourceService.findResourceById(resourceId)
    skillEntity.resource = FullResourceDto.toEntity(resource)

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
  async editSkill(updatedSkillData: SlimSkillDto): Promise<SkillEntity> {
    let existingSkillEntity = await this.skillsRepository.findOne(updatedSkillData.id, {
      relations: ['resource', 'skill'],
    })
    if (!existingSkillEntity) {
      throw new NotFoundException(`Could not find skill with id ${updatedSkillData.id}`)
    }

    // Only let users change the level of a specific skill
    delete updatedSkillData.skill
    existingSkillEntity.level = updatedSkillData.level
    return await this.skillsRepository.save(existingSkillEntity)
  }

  // delete skill
  async deleteSkill(skillId: number) {
    let skillEntity = await this.skillsRepository.findOne(skillId)
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skillId}`)
    }
    this.skillsRepository.remove(skillEntity)
  }
}
