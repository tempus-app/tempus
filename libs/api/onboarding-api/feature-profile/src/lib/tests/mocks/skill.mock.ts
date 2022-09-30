import { SkillEntity, SkillTypeEntity } from '@tempus/api/shared/entity';
import { resourceEntity } from './resource.mock';

export const skillTypeEntity: SkillTypeEntity = {
	name: 'mockskilltype',
};

export const createSkillEntity = new SkillEntity(null, skillTypeEntity, null);

export const createdSkillEntity: SkillEntity = {
	id: 2,
	skill: skillTypeEntity,
	resource: resourceEntity,
};
