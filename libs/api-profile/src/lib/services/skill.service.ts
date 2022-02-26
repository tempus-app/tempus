import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from '@tempus/api-account';
import { CreateSkillDto, Skill, SkillEntity, SkillType, SkillTypeEntity, UpdateSkillDto } from '@tempus/datalayer';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
	constructor(
		private resourceService: ResourceService,
		@InjectRepository(SkillEntity)
		private skillsRepository: Repository<SkillEntity>,
		@InjectRepository(SkillTypeEntity)
		private skillTypeRepository: Repository<SkillTypeEntity>
	) {}

	// create skill for a specific resource
	async createSkill(resourceId: number, skillData: SkillEntity): Promise<SkillEntity> {
		let skillEntity = CreateSkillDto.toEntity(skillData);
		let skillTypeEntity = await this.skillTypeRepository.findOne(skillData.skill.name);

		if (!skillTypeEntity) {
			skillTypeEntity = new SkillTypeEntity(skillData.skill.name);
			await this.skillTypeRepository.save(skillTypeEntity);
		}
		skillEntity.skill = skillTypeEntity;

		const resourceEntity = await this.resourceService.getResource(resourceId);
		skillEntity.resource = resourceEntity;

		skillEntity = await this.skillsRepository.save(skillEntity);

		return skillEntity;
	}

	// return skills by resource
	async findSkillsByResource(resourceId: number): Promise<Skill[]> {
		const skillEntities = await this.skillsRepository.find({
			where: { resource: { id: resourceId } },
			relations: ['resource', 'skill'],
		});
		return skillEntities;
	}

	async findAllSkillTypes(): Promise<SkillType[]> {
		const skillTypeEntities = await this.skillTypeRepository.find();
		return skillTypeEntities;
	}

	// return skill by id
	async findSkillById(skillId: number): Promise<Skill> {
		const skillEntity = await this.skillsRepository.findOne(skillId, { relations: ['resource', 'skill'] });
		if (!skillEntity) {
			throw new NotFoundException(`Could not find skill with id ${skillId}`);
		}
		return skillEntity;
	}

	// edit skill -- NEED REWORKING
	async editSkill(updatedSkillData: UpdateSkillDto): Promise<Skill> {
		const existingSkillEntity = await this.skillsRepository.findOne(updatedSkillData.id, {
			relations: ['resource', 'skill'],
		});
		if (!existingSkillEntity) {
			throw new NotFoundException(`Could not find skill with id ${updatedSkillData.id}`);
		}

		existingSkillEntity.level = updatedSkillData.level;
		return this.skillsRepository.save(existingSkillEntity);
	}

	// delete skill
	async deleteSkill(skillId: number) {
		const skillEntity = await this.skillsRepository.findOne(skillId);
		if (!skillEntity) {
			throw new NotFoundException(`Could not find skill with id ${skillId}`);
		}
		this.skillsRepository.remove(skillEntity);
	}
}
