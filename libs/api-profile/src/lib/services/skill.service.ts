import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimSkillDto, SkillEntity, SkillTypeEntity, FullSkillDto } from '@tempus/datalayer'
import { FullSkillTypeDto } from 'libs/datalayer/src/lib/dtos/profile-dtos/skill/fullSkillType.dto'
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
  async createSkill(resourceId: number, skillData: SlimSkillDto): Promise<FullSkillDto> {
    let skillEntity = SlimSkillDto.toEntity(skillData)
    let skillTypeEntity = await this.skillTypeRepository.findOne(skillData.skill.name)

    if (!skillTypeEntity) {
      skillTypeEntity = new SkillTypeEntity(skillData.skill.name)
    }
    skillEntity.skill = skillTypeEntity

    let resourceEntity = await this.resourceService.findResourceById(resourceId)
    skillEntity.resource = resourceEntity

    skillEntity = await this.skillsRepository.save(skillEntity)

    return FullSkillDto.fromEntity(skillEntity)

  }

  // return skills by resource
  async findSkillsByResource(resourceId: number): Promise<FullSkillDto[]> {
    let skillEntities = await this.skillsRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource', 'skill'],
    })
    let fullSkillDtos = skillEntities.map((entity) => FullSkillDto.fromEntity(entity))
    return fullSkillDtos
  }

  async findAllSkillTypes(): Promise<FullSkillTypeDto[]> {
    let skillTypeEntities = await this.skillTypeRepository.find()
    return skillTypeEntities.map(entity => FullSkillTypeDto.fromEntity(entity))
  }

  // return skill by id
  async findSkillById(skillId: number): Promise<FullSkillDto> {
    let skillEntity = await this.skillsRepository.findOne(skillId, { relations: ['resource', 'skill'] })
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skillId}`)
    }
    return FullSkillDto.fromEntity(skillEntity)
  }

  // edit skill
  async editSkill(skill: SlimSkillDto): Promise<FullSkillDto> {
    let skillEntity = await this.skillsRepository.findOne(skill.id)
    if (!skillEntity) {
      throw new NotFoundException(`Could not find skill with id ${skill.id}`)
    }
    await this.skillsRepository.update(skill.id, SlimSkillDto.toEntity(skill))
    let updatedEntity = await this.skillsRepository.findOne(skill.id, { relations: ['resource', 'skill'] })
    return FullSkillDto.fromEntity(updatedEntity)
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
