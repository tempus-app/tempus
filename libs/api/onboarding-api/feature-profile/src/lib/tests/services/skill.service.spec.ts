import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { resourceEntity } from '../mocks/resource.mock'
import { SkillsService } from '../../services';
import { SkillEntity, SkillTypeEntity } from '@tempus/api/shared/entity';
import { createdSkillEntity, createSkillEntity, skillTypeEntity } from '../mocks/skill.mock'


const mockSkillRepository = createMock<Repository<SkillEntity>>();
const mockSkillTypeRepository = createMock<Repository<SkillTypeEntity>>();
const mockResourceService = createMock<ResourceService>()

describe('SkillService', () => {
	let moduleRef: TestingModule;
	let skillService: SkillsService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				SkillsService,
				{
					provide: getRepositoryToken(SkillEntity),
					useValue: mockSkillRepository,
				},
        {
					provide: getRepositoryToken(SkillTypeEntity),
					useValue: mockSkillTypeRepository,
				},
				{
					provide: ResourceService,
					useValue: mockResourceService,
				}
			],
		}).compile();

		skillService = moduleRef.get<SkillsService>(SkillsService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

  describe('FindSkillsByResource()', () => {
    it('should find skills by resource', async () => {
      const skills = [createdSkillEntity, createdSkillEntity]
      mockSkillRepository.find.mockResolvedValue(skills)
      const res = await skillService.findSkillsByResource(1)
      expect(mockSkillRepository.find).toBeCalledWith({ relations: ['resource', 'skill'], where: {"resource": {"id": 1}} });
      expect(res).toEqual(skills)
    })
  });

	describe('CreateSkill()', () => {
		it('should create skill given existing skill type', async () => {

      mockSkillTypeRepository.findOne.mockResolvedValue(skillTypeEntity)

      mockResourceService.getResource.mockResolvedValue(resourceEntity)			
      mockSkillRepository.save.mockResolvedValue(createdSkillEntity)

      const res = await skillService.createSkill(1, createSkillEntity);

      expect(mockSkillRepository.save).toBeCalledWith({ ...createdSkillEntity, id: undefined });
			expect(res).toEqual(createdSkillEntity)
		});
    it('should create skill given non existing skill type', async () => {
  
      mockSkillTypeRepository.findOne.mockResolvedValue(undefined)
      mockSkillTypeRepository.save.mockResolvedValue(skillTypeEntity)

      mockResourceService.getResource.mockResolvedValue(resourceEntity)			
      mockSkillRepository.save.mockResolvedValue(createdSkillEntity)

      const res = await skillService.createSkill(1, createSkillEntity);

      expect(mockSkillRepository.save).toBeCalledWith({ ...createdSkillEntity, id: undefined });
			expect(res).toEqual(createdSkillEntity)
		});
	});

  describe('FindAllSkillTypes', () => {
    it('should find all skill types', async () => {
      const skillTypes: Array<SkillTypeEntity> = [new SkillTypeEntity('skilltype1'), new SkillTypeEntity('skilltype2')]
      mockSkillTypeRepository.find.mockResolvedValue(skillTypes)
      const res = await skillService.findAllSkillTypes()
      expect(mockSkillTypeRepository.find).toHaveBeenCalled()
      expect(res).toEqual(skillTypes)
    })
  })

  describe('FindSkillById()', () => {
    it('should find skill by id', async () => {
      mockSkillRepository.findOne.mockResolvedValue(createdSkillEntity)

      const res = await skillService.findSkillById(1)

      expect(mockSkillRepository.findOne).toBeCalledWith(1, { relations: ['resource', 'skill'] });
      expect(res).toEqual(createdSkillEntity)
    })
    it('should throw an error if id not found', async () => {
			mockSkillRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await skillService.findSkillById(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Could not find skill with id 3')
		});
  })

  describe('DeleteSkill()', () => {
    it('should delete skill', async () => {
      mockSkillRepository.findOne.mockResolvedValue(createdSkillEntity)
      const res = await skillService.deleteSkill(1)
      expect(mockSkillRepository.findOne).toBeCalledWith(1);
      expect(mockSkillRepository.remove).toBeCalledWith(createdSkillEntity)
    })
    it('should throw an error if id not found', async () => {
			mockSkillRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await skillService.deleteSkill(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Could not find skill with id 3')
		});
  })

});
