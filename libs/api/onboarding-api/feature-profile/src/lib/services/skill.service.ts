import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity, SkillTypeEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Skill, SkillType } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
	constructor(
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
		@InjectRepository(SkillEntity)
		private skillsRepository: Repository<SkillEntity>,
		@InjectRepository(SkillTypeEntity)
		private skillTypeRepository: Repository<SkillTypeEntity>,
	) {}

	// create skill for a specific resource
	async createSkill(resourceId: number, skillData: SkillEntity): Promise<SkillEntity> {
		let skillEntity = SkillEntity.fromDto(skillData);
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

	// delete skill
	async deleteSkill(skillId: number) {
		const skillEntity = await this.skillsRepository.findOne(skillId);
		if (!skillEntity) {
			throw new NotFoundException(`Could not find skill with id ${skillId}`);
		}
		this.skillsRepository.remove(skillEntity);
	}
}
