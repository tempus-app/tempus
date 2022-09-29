import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { ViewsService } from '../../services';
import { RevisionEntity, ViewEntity } from '@tempus/api/shared/entity';
import { viewEntity, viewEntity2, createdViewEntityPostRevision, resourceUserEntity, newViewDto, businessOwnerUserEntity, viewEntity3 } from '../mocks/view.mock'
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { resourceEntity } from '../mocks/resource.mock';
import { RevisionType, RoleType, ViewType } from '@tempus/shared-domain';


const mockViewRepository = createMock<Repository<ViewEntity>>();
const mockRevisionRepository = createMock<Repository<RevisionEntity>>();
const mockResourceService = createMock<ResourceService>()

Date.now = jest.fn(() => Date.parse('2017-02-14'))

describe('ViewService', () => {
	let moduleRef: TestingModule;
	let viewService: ViewsService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				ViewsService,
				{
					provide: getRepositoryToken(ViewEntity),
					useValue: mockViewRepository,
				},
        {
					provide: getRepositoryToken(RevisionEntity),
					useValue: mockRevisionRepository,
				},
				{
					provide: ResourceService,
					useValue: mockResourceService,
				}
			],
		}).compile();

		viewService = moduleRef.get<ViewsService>(ViewsService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

  describe('GetView()', () => {
    it('should find view without revision', async () => {
      mockViewRepository.findOne.mockResolvedValue(viewEntity)
      const res = await viewService.getView(3)
      expect(mockViewRepository.findOne).toBeCalledWith(3, { relations: [
				'experiences',
				'resource',
				'educations',
				'skills',
				'experiences.location',
				'educations.location',
				'certifications',
				'skills.skill',
        'revision',
				'revision.views'
			], });
      expect(mockViewRepository.findOne).toHaveBeenCalledTimes(1)
      expect(res).toEqual(viewEntity)
    })
    it('should find view with revision', async () => {
      const existingViewWithRevision: ViewEntity = {
        ...viewEntity,
        revision: {
          views: [viewEntity, viewEntity2],
        } as RevisionEntity
      }
      mockViewRepository.findOne.mockResolvedValueOnce(existingViewWithRevision)
      mockViewRepository.findOne.mockResolvedValueOnce(viewEntity2)
      const res = await viewService.getView(3)
      expect(mockViewRepository.findOne).toBeCalledWith(3, { relations: [
				'experiences',
				'resource',
				'educations',
				'skills',
				'experiences.location',
				'educations.location',
				'certifications',
				'skills.skill',
        'revision',
				'revision.views',
			], });
      expect(mockViewRepository.findOne).toBeCalledWith(4, { relations: [
				'experiences',
				'resource',
				'educations',
				'skills',
				'experiences.location',
				'educations.location',
				'certifications',
				'skills.skill',
        'revision',
				'revision.views',
			], });
      expect(mockViewRepository.findOne).toHaveBeenCalledTimes(2)
      expect(res).toEqual(existingViewWithRevision)
    })
    it('should throw an error if id not found', async () => {
			mockViewRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await viewService.getView(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Could not find view with id 3')
		});
  });

  describe('GetViewsByResource()', () => {
    it('should get views by resource', async () => {
      const returnedViews = [viewEntity, viewEntity2]
      mockViewRepository.find.mockResolvedValue(returnedViews)
      const res = await viewService.getViewsByResource(0)
      expect(mockViewRepository.find).toHaveBeenCalledWith({
        relations: [
          'experiences',
          'educations',
          'skills',
          'experiences.location',
          'educations.location',
          'skills.skill',
          'certifications',
          'revision',
          'revision.views'
        ],
        where: {
          resource: {
            id: 0,
          },
        },
      })
      expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(0)
      expect(res).toEqual(returnedViews)
    })
  })

  describe('ReviseView()', () => {
    it('should revise view given resource has edited and non existing revision', async () => {

      // Original view is locked, new view created, revision created linking the two views, new created view and revision saved

      const createdViewEntity: ViewEntity = {
        ...createdViewEntityPostRevision,
        updatedBy: RoleType.USER
      }

      // Making a copy b/c service updates properties (dont want these updates to affect other tests)
      const existingViewEntity: ViewEntity = {
        ...viewEntity
      }

      const createdRevisionEntity: RevisionEntity = new RevisionEntity(null, createdViewEntity.createdAt, null, [existingViewEntity, createdViewEntity])
      const getViewSpy = jest.spyOn(viewService, 'getView')

      mockViewRepository.findOne.mockResolvedValue(existingViewEntity)
      mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity)

      mockViewRepository.save.mockResolvedValueOnce(createdViewEntity)
      mockViewRepository.save.mockResolvedValueOnce({...existingViewEntity, locked: true})

      mockRevisionRepository.save.mockResolvedValue({...createdRevisionEntity, id: 3})

      const res = await viewService.reviseView(3, resourceUserEntity, newViewDto)

      expect(getViewSpy).toHaveBeenCalledWith(3)
      expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id)
      expect(mockViewRepository.save).toHaveBeenNthCalledWith(1, {...createdViewEntity, id: undefined})
      expect(mockViewRepository.save).toHaveBeenNthCalledWith(2, {...existingViewEntity, locked: true})
      expect(mockRevisionRepository.save).toHaveBeenCalledWith(createdRevisionEntity)
      expect(res).toEqual({...createdRevisionEntity, id: 3})
    })
    it('should revise view given business owner has edited and non existing revision', async () => {

      // Whenever a business owner edits a view, its auto approved and no revision entity needs to be made

      const createdViewEntity: ViewEntity = {
        ...createdViewEntityPostRevision,
        createdAt: viewEntity.createdAt,
        revisionType: RevisionType.APPROVED,
        updatedBy: RoleType.BUSINESS_OWNER
      }

      const getViewSpy = jest.spyOn(viewService, 'getView')

      mockViewRepository.findOne.mockResolvedValue(viewEntity)
      mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity)

      const res = await viewService.reviseView(3, businessOwnerUserEntity, newViewDto)

      expect(getViewSpy).toHaveBeenCalledWith(3)
      expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id)
      expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntity)
      expect(mockViewRepository.save).toHaveBeenCalledWith({...createdViewEntity, id: undefined})
      expect(res).toEqual(null)
    })
    it('should revise view given resource has edited and existing revision', async () => {

      // Original view locked, original revisions new view is updated to a new created view, revision and new created view saved

      const createdViewEntity: ViewEntity = {
        ...createdViewEntityPostRevision,
        updatedBy: RoleType.USER
      }

      const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1,2,3), null, [viewEntity3, viewEntity2])

      const existingViewEntityWithRevision: ViewEntity = {
        ...viewEntity3,
        revision: oldRevisionEntity,
      }

      const newRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1,2,3), null, [viewEntity3,createdViewEntity])

      const getViewSpy = jest.spyOn(viewService, 'getView')

      mockViewRepository.findOne.mockResolvedValueOnce(existingViewEntityWithRevision)
      mockViewRepository.findOne.mockResolvedValueOnce(viewEntity2) // this  comes from getView call
      mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity)

      mockViewRepository.save.mockResolvedValueOnce(createdViewEntity)
      mockViewRepository.save.mockResolvedValueOnce({...existingViewEntityWithRevision, locked: true})

      mockRevisionRepository.save.mockResolvedValue({...newRevisionEntity, id: 3})

      const res = await viewService.reviseView(3, resourceUserEntity, newViewDto)

      expect(getViewSpy).toHaveBeenCalledWith(3)
      expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id)
      expect(mockViewRepository.save).toHaveBeenNthCalledWith(1, {...createdViewEntity, id: undefined})
      expect(mockViewRepository.save).toHaveBeenNthCalledWith(2, {...existingViewEntityWithRevision, locked: true})
      expect(mockRevisionRepository.save).toHaveBeenNthCalledWith(1, newRevisionEntity)
      expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntity2)
      expect(res).toEqual({...newRevisionEntity, id: 3})
    })
    it('should revise view given business owner has edited and existing revision', async () => {

      // Whenever a business owner edits a view, its auto approved and no revision entity needs to be made

      const createdViewEntity: ViewEntity = {
        ...createdViewEntityPostRevision,
        createdAt: viewEntity.createdAt,
        revisionType: RevisionType.APPROVED,
        updatedBy: RoleType.BUSINESS_OWNER
      }

      const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1,2,3), null, [viewEntity3, viewEntity2])

      const viewEntityWithRevision: ViewEntity = {
        ...viewEntity3,
        revision: oldRevisionEntity,
      }

      const getViewSpy = jest.spyOn(viewService, 'getView')

      mockViewRepository.findOne.mockResolvedValueOnce(viewEntityWithRevision)
      mockViewRepository.findOne.mockResolvedValueOnce(viewEntity2) // this  comes from getView call
      mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity)

      const res = await viewService.reviseView(3, businessOwnerUserEntity, newViewDto)

      expect(getViewSpy).toHaveBeenCalledWith(3)
      expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id)
      expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntityWithRevision)
      expect(mockViewRepository.save).toHaveBeenCalledWith({...createdViewEntity, id: undefined})
      expect(res).toEqual(null)
    })
    it('should throw error if editing locked view', async () => {
      const lockedView: ViewEntity = {
        ...viewEntity,
        locked: true
      }
      mockViewRepository.findOne.mockResolvedValue(lockedView);
			let error;
			try {
				await viewService.reviseView(3, resourceUserEntity, lockedView);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Cannot edit locked view')
    })
  })

  describe('DeleteView()', () => {
    it('should delete view', async () => {
      mockViewRepository.findOne.mockResolvedValue(viewEntity2)
      const res = await viewService.deleteView(4)
      expect(mockViewRepository.findOne).toBeCalledWith(4);
      expect(mockViewRepository.remove).toBeCalledWith(viewEntity2)
    })
    it('should throw an error if id not found', async () => {
			mockViewRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await viewService.deleteView(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Could not find view with id 3')
		});
    it('should throw an error if view is primary', async () => {
			mockViewRepository.findOne.mockResolvedValue(viewEntity);
			let error;
			try {
				await viewService.deleteView(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(ForbiddenException);
      expect(error.message).toEqual('Cannot delete primary view')
		});
  })

});
