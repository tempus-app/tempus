import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { RevisionEntity, UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RevisionType, RoleType } from '@tempus/shared-domain';
import { ViewsService } from '../../services';
import {
	viewEntity,
	viewEntity2,
	createdViewEntityPostRevision,
	resourceUserEntity,
	newViewDto,
	newSecondaryViewDto,
	businessOwnerUserEntity,
	viewEntity3,
	rejectViewDto,
	approveViewDto,
	createdViewEntity,
	supervisorUserEntity,
	businessOwnerCreatedSecondaryViewEntity,
	resourceCreatedSecondaryViewEntity,
  supervisorJwtPayload,
  businessOwnerJwtPayload,
} from '../mocks/view.mock';
import { resourceEntity } from '../mocks/resource.mock';

const mockViewRepository = createMock<Repository<ViewEntity>>();
const mockRevisionRepository = createMock<Repository<RevisionEntity>>();
const mockResourceService = createMock<ResourceService>();

const CUR_DATE_CONSTANT = Date.parse('2000-01-01');
Date.now = jest.fn(() => CUR_DATE_CONSTANT);

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
				},
			],
		}).compile();

		viewService = moduleRef.get<ViewsService>(ViewsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('CreateView()', () => {
		it('should create new primary view', async () => {
			const createdView: ViewEntity = {
				...createdViewEntity,
				createdAt: new Date(CUR_DATE_CONSTANT),
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				resource: resourceEntity,
			};
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockViewRepository.save.mockResolvedValue(createdView);

			const res = await viewService.createView(0, newViewDto);

			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(0);
			expect(mockViewRepository.save).toHaveBeenCalledWith({ ...createdView, id: undefined });
			expect(res).toEqual(createdView);
		});
	});

	describe('CreateSecondaryView()', () => {
		it('should create a new approved view given created by business owner', async () => {
			const createdView: ViewEntity = {
				...businessOwnerCreatedSecondaryViewEntity,
				createdAt: new Date(CUR_DATE_CONSTANT),
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				updatedBy: RoleType.BUSINESS_OWNER,
				resource: resourceEntity,
			};
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockViewRepository.save.mockResolvedValue(createdView);

			const res = await viewService.createSecondaryView(0, businessOwnerUserEntity, newSecondaryViewDto);

			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(0);
			expect(mockViewRepository.save).toHaveBeenCalledWith({ ...createdView, id: undefined });
			expect(res).toEqual(createdView);
		});

		it('should create a new pending view given created by resource', async () => {
			const createdView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
				createdAt: new Date(CUR_DATE_CONSTANT),
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				updatedBy: RoleType.USER,
				resource: resourceEntity,
			};
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockViewRepository.save.mockResolvedValue(createdView);

			const res = await viewService.createSecondaryView(0, resourceEntity, newSecondaryViewDto);

			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(0);
			expect(mockViewRepository.save).toHaveBeenCalledWith({ ...createdView, id: undefined });
			expect(res).toEqual(createdView);
		});
	});

	describe('GetView()', () => {
		it('should find view without revision', async () => {
			mockViewRepository.findOne.mockResolvedValue(viewEntity);
			const res = await viewService.getView(3);
			expect(mockViewRepository.findOne).toBeCalledWith(3, {
				relations: [
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
				],
			});
			expect(mockViewRepository.findOne).toHaveBeenCalledTimes(1);
			expect(res).toEqual(viewEntity);
		});
		it('should find view with revision', async () => {
			const existingViewWithRevision: ViewEntity = {
				...viewEntity,
				revision: {
					views: [viewEntity, viewEntity2],
				} as RevisionEntity,
			};
			mockViewRepository.findOne.mockResolvedValueOnce(existingViewWithRevision);
			mockViewRepository.findOne.mockResolvedValueOnce(viewEntity2);
			const res = await viewService.getView(3);
			expect(mockViewRepository.findOne).toBeCalledWith(3, {
				relations: [
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
				],
			});
			expect(mockViewRepository.findOne).toBeCalledWith(4, {
				relations: [
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
				],
			});
			expect(mockViewRepository.findOne).toHaveBeenCalledTimes(2);
			expect(res).toEqual(existingViewWithRevision);
		});
		it('should throw an error if id not found', async () => {
			mockViewRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await viewService.getView(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find view with id 3');
		});
	});

	describe('GetViewsByResource()', () => {
		it('should get views by resource', async () => {
			const returnedViews = [viewEntity, viewEntity2];
			mockViewRepository.findAndCount.mockResolvedValue([returnedViews, 2]);
			const res = await viewService.getViewsByResource(0, 0, 1000);
			expect(mockViewRepository.findAndCount).toHaveBeenCalledWith({
				relations: [
					'experiences',
					'educations',
					'skills',
					'experiences.location',
					'educations.location',
					'skills.skill',
					'certifications',
					'revision',
					'revision.views',
				],
				where: {
					resource: {
						id: 0,
					},
				},
				take: Number(1000),
				skip: Number(0) * Number(1000),
			});
			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(0);
			expect(res.views).toEqual(returnedViews);
		});
	});

	describe('ReviseView()', () => {
		it('should revise view given resource has edited and non existing revision', async () => {
			// Original view is locked, new view created, revision created linking the two views, new created view and revision saved

			const createdViewEntity: ViewEntity = {
				...createdViewEntityPostRevision,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				createdAt: new Date(CUR_DATE_CONSTANT),
				updatedBy: RoleType.USER,
			};

			// Making a copy b/c service updates properties (dont want these updates to affect other tests)
			const existingViewEntity: ViewEntity = {
				...viewEntity,
			};

			const createdRevisionEntity: RevisionEntity = new RevisionEntity(null, createdViewEntity.createdAt, null, [
				existingViewEntity,
				createdViewEntity,
			]);
			const getViewSpy = jest.spyOn(viewService, 'getView');

			mockViewRepository.findOne.mockResolvedValue(existingViewEntity);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);

			mockViewRepository.save.mockResolvedValueOnce(createdViewEntity);
			mockViewRepository.save.mockResolvedValueOnce({ ...existingViewEntity, locked: true });

			mockRevisionRepository.save.mockResolvedValue({ ...createdRevisionEntity, id: 3 });

			const res = await viewService.reviseView(3, resourceUserEntity, newViewDto);

			expect(getViewSpy).toHaveBeenCalledWith(3);
			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id);
			expect(mockViewRepository.save).toHaveBeenNthCalledWith(1, { ...createdViewEntity, id: undefined });
			expect(mockViewRepository.save).toHaveBeenNthCalledWith(2, { ...existingViewEntity, locked: true });
			expect(mockRevisionRepository.save).toHaveBeenCalledWith(createdRevisionEntity);
			expect(res).toEqual({ ...createdRevisionEntity, id: 3 });
		});
		it('should revise view given business owner has edited and non existing revision', async () => {
			// Whenever a business owner edits a view, its auto approved and no revision entity needs to be made

			adminReviseViewNonExistingRevision(businessOwnerUserEntity);
		});
		it('should revise view given supervisor has edited and non existing revision', async () => {
			// Whenever a supervisor edits a view, its auto approved and no revision entity needs to be made

			adminReviseViewNonExistingRevision(supervisorUserEntity);
		});

		it('should revise view given resource has edited and existing revision', async () => {
			// Original view locked, original revisions new view is updated to a new created view that is locked and pending (deletion of old revised view occurs), revision and new created view saved
			// This case can only occur given a previous rejection of a revision (else the rev entity wouldnt exist if there was a previous positive approval)

      const existingViewEntityEdited: ViewEntity = {
        ...viewEntity,
        revisionType: RevisionType.PENDING
      }

			const createdViewEntity: ViewEntity = {
				...createdViewEntityPostRevision,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				createdAt: new Date(CUR_DATE_CONSTANT),
				updatedBy: RoleType.USER,
			};

			// placeholder revision (technically should be the oldRevisionEntity but will cause circular reference issues for the tests)
			const revisedViewBeforeRevision: ViewEntity = {
				...viewEntity2,
				revision: new RevisionEntity(),
				locked: false,
				revisionType: RevisionType.REJECTED,
			};
			const revisedViewAfterRevision: ViewEntity = {
				...createdViewEntity,
				revision: undefined,
				locked: true,
				revisionType: RevisionType.PENDING,
			};

			const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1, 2, 3), false, [
				existingViewEntityEdited,
				revisedViewBeforeRevision,
			]);

			const existingViewEntityWithRevision: ViewEntity = {
				...existingViewEntityEdited,
				revision: oldRevisionEntity,
			};

			const newRevisionEntity: RevisionEntity = {
				...oldRevisionEntity,
				views: [revisedViewAfterRevision, existingViewEntityEdited],
			};

			const getViewSpy = jest.spyOn(viewService, 'getView');

			mockViewRepository.findOne.mockResolvedValueOnce(existingViewEntityWithRevision);
			mockViewRepository.findOne.mockResolvedValueOnce(revisedViewBeforeRevision); // this  comes from getView call
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);

			mockViewRepository.save.mockResolvedValueOnce(createdViewEntity);
			mockViewRepository.save.mockResolvedValueOnce({ ...existingViewEntityWithRevision, locked: true });

			mockRevisionRepository.save.mockResolvedValue({ ...newRevisionEntity, id: 3 });

			const res = await viewService.reviseView(3, resourceUserEntity, newViewDto);

			expect(getViewSpy).toHaveBeenCalledWith(3);
			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id);
			expect(mockViewRepository.save).toHaveBeenNthCalledWith(1, { ...createdViewEntity, id: undefined });
			expect(mockViewRepository.save).toHaveBeenNthCalledWith(2, {
				...existingViewEntityWithRevision,
				locked: true,
			});
			expect(mockRevisionRepository.save).toHaveBeenNthCalledWith(1, newRevisionEntity);
			expect(mockViewRepository.remove).toHaveBeenCalledWith(revisedViewBeforeRevision);
			expect(res).toEqual({ ...newRevisionEntity, id: 3 });
		});
		it('should revise view given business owner has edited and existing revision', async () => {
			// Whenever a business owner edits a view, its auto approved and any existing revisons need to be removed
			// This case can only occur given a previous rejection of a revision (else the rev entity wouldnt exist if there was a previous positive approval)

			adminReviseViewExistingRevision(businessOwnerUserEntity);
		});
		it('should revise view given supervisor has edited and existing revision', async () => {
			// Whenever a supervisor edits a view, its auto approved and any existing revisons need to be removed
			// This case can only occur given a previous rejection of a revision (else the rev entity wouldnt exist if there was a previous positive approval)

			adminReviseViewExistingRevision(supervisorUserEntity);
		});
		it('should throw error if resource editing locked view', async () => {
			const lockedView: ViewEntity = {
				...viewEntity,
				locked: true,
			};
			mockViewRepository.findOne.mockResolvedValue(lockedView);
			let error;
			try {
				await viewService.reviseView(3, resourceUserEntity, lockedView);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(UnauthorizedException);
			expect(error.message).toEqual('Cannot edit locked view');
		});

		const adminReviseViewNonExistingRevision = async (user: UserEntity) => {
			const createdViewEntity: ViewEntity = {
				...createdViewEntityPostRevision,
				createdAt: viewEntity.createdAt,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				locked: false,
				revisionType: RevisionType.APPROVED,
				updatedBy: user.roles[0],
			};

			const getViewSpy = jest.spyOn(viewService, 'getView');

			mockViewRepository.findOne.mockResolvedValue(viewEntity);
			mockViewRepository.save.mockResolvedValue(createdViewEntity);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);

			const res = await viewService.reviseView(3, user, newViewDto);

			expect(getViewSpy).toHaveBeenCalledWith(3);
			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id);
			expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntity);
			expect(mockViewRepository.save).toHaveBeenCalledWith({ ...createdViewEntity, id: undefined });
			expect(res).toEqual(createdViewEntity);
		};

		const adminReviseViewExistingRevision = async (user: UserEntity) => {
			const createdViewEntity: ViewEntity = {
				...createdViewEntityPostRevision,
				createdAt: viewEntity3.createdAt,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
				revisionType: RevisionType.APPROVED,
				locked: false,
				updatedBy: user.roles[0],
			};

			const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1, 2, 3), null, [
				viewEntity3,
				{ ...viewEntity2, revision: new RevisionEntity(), locked: false, revisionType: RevisionType.REJECTED },
			]);

			const viewEntityWithRevision: ViewEntity = {
				...viewEntity3,
				revision: oldRevisionEntity,
			};

			const getViewSpy = jest.spyOn(viewService, 'getView');

			mockViewRepository.findOne.mockResolvedValueOnce(viewEntityWithRevision);
			mockViewRepository.findOne.mockResolvedValueOnce(viewEntity2); // this  comes from getView call
			mockViewRepository.save.mockResolvedValue(createdViewEntity);
			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);

			const res = await viewService.reviseView(3, user, newViewDto);

			expect(getViewSpy).toHaveBeenCalledWith(3);
			expect(mockResourceService.getResourceInfo).toHaveBeenCalledWith(viewEntity.resource.id);
			expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntityWithRevision);
			expect(mockRevisionRepository.remove).toHaveBeenCalledWith(oldRevisionEntity);
			expect(mockViewRepository.save).toHaveBeenCalledWith({ ...createdViewEntity, id: undefined });
			expect(res).toEqual(createdViewEntity);
		};
	});

	describe('DeleteView()', () => {
		it('should delete view as business owner', async () => {
			mockViewRepository.findOne.mockResolvedValue(viewEntity2);
			const res = await viewService.deleteView(businessOwnerJwtPayload, 4);
			expect(mockViewRepository.findOne).toBeCalledWith(4);
			expect(mockViewRepository.remove).toBeCalledWith(viewEntity2);
		});
		it('should throw an error if id not found', async () => {
			mockViewRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await viewService.deleteView(businessOwnerJwtPayload, 3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find view with id 3');
		});
		it('should throw an error if view is primary', async () => {
			mockViewRepository.findOne.mockResolvedValue(viewEntity);
			let error;
			try {
				await viewService.deleteView(businessOwnerJwtPayload, 3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(ForbiddenException);
			expect(error.message).toEqual('Cannot delete primary view');
		});
    it('should throw an error if supervisor deleting', async () => {
			mockViewRepository.findOne.mockResolvedValue(viewEntity);
			let error;
			try {
				await viewService.deleteView(supervisorJwtPayload, 4);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(ForbiddenException);
			expect(error.message).toEqual('Forbidden. Supervisors cannot delete views');
		});
	});

	describe('ApproveOrDenyView()', () => {
		it('should reject view given rejection', async () => {
			const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1, 2, 3), false, [
				viewEntity,
				{ ...viewEntity2, locked: true, revisionType: RevisionType.PENDING },
			]);
			const newRevisionEntity: RevisionEntity = {
				...oldRevisionEntity,
				views: [{ ...viewEntity2, locked: false, revisionType: RevisionType.REJECTED }, viewEntity],
				comment: rejectViewDto.comment,
			};

			const existingViewEntityWithRevision: ViewEntity = {
				...viewEntity,
				revision: oldRevisionEntity,
			};

			mockViewRepository.findOne.mockResolvedValue(existingViewEntityWithRevision);

			const res = await viewService.approveOrDenyView(3, rejectViewDto);

			expect(mockViewRepository.findOne).toHaveBeenCalledWith({
				where: { id: 3 },
				relations: ['revision', 'revision.views'],
			});
			expect(mockViewRepository.save).toHaveBeenCalledWith({
				...viewEntity2,
				revisionType: RevisionType.REJECTED,
				locked: false,
			});
			expect(mockRevisionRepository.save).toHaveBeenCalledWith(newRevisionEntity);
		});
		it('should accept view given approval', async () => {
			// placeholder revision (technically should be the oldRevisionEntity but will cause circular reference issues for the tests)
			const revisedViewBeforeApproval: ViewEntity = {
				...viewEntity2,
				locked: true,
				revisionType: RevisionType.PENDING,
				revision: new RevisionEntity(),
			};
			const revisedViewAfterApproval: ViewEntity = {
				...viewEntity2,
				locked: false,
				revisionType: RevisionType.APPROVED,
				revision: null,
				createdAt: viewEntity.createdAt,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
			};
			const oldRevisionEntity: RevisionEntity = new RevisionEntity(null, new Date(1, 2, 3), false, [
				viewEntity,
				revisedViewBeforeApproval,
			]);

			const existingViewEntityWithRevision: ViewEntity = {
				...viewEntity,
				revision: oldRevisionEntity,
			};

			mockViewRepository.findOne.mockResolvedValue(existingViewEntityWithRevision);

			const res = await viewService.approveOrDenyView(3, approveViewDto);

			expect(mockViewRepository.findOne).toHaveBeenCalledWith({
				where: { id: 3 },
				relations: ['revision', 'revision.views'],
			});
			expect(mockViewRepository.remove).toHaveBeenCalledWith(viewEntity);
			expect(mockViewRepository.save).toHaveBeenCalledWith(revisedViewAfterApproval);
			expect(mockRevisionRepository.remove).toHaveBeenCalledWith(oldRevisionEntity);
		});
		it('should accept new secondary view given approval', async () => {
			const pendingNewView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
			};

			const approvedNewView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
				locked: false,
				revisionType: RevisionType.APPROVED,
				revision: null,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
			};

			mockViewRepository.findOne.mockResolvedValue(pendingNewView);
			mockViewRepository.save.mockResolvedValue(approvedNewView);

			const res = await viewService.approveOrDenyView(pendingNewView.id, approveViewDto);

			expect(mockViewRepository.save).toHaveBeenCalledWith(approvedNewView);
			expect(res).toEqual(approvedNewView);
		});
		it('should accept edited secondary view given approval', async () => {
			const editedSecondaryViewEntity: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
				locked: true,
				revisionType: RevisionType.PENDING,
			};

			const revision: RevisionEntity = new RevisionEntity(null, new Date(1, 2, 3), false, [
				editedSecondaryViewEntity,
			]);

			editedSecondaryViewEntity.revision = revision;

			const approvedNewView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
				locked: false,
				revisionType: RevisionType.APPROVED,
				revision: null,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
			};

			mockViewRepository.findOne.mockResolvedValue(editedSecondaryViewEntity);
			mockViewRepository.save.mockResolvedValue(approvedNewView);

			const res = await viewService.approveOrDenyView(editedSecondaryViewEntity.id, approveViewDto);

			expect(mockRevisionRepository.remove).toHaveBeenCalledWith(revision);
			expect(mockViewRepository.save).toHaveBeenCalledWith(approvedNewView);
			expect(res).toEqual(approvedNewView);
		});
		it('should reject new secondary view given rejection', async () => {
			const pendingNewView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
			};

			const rejectedNewView: ViewEntity = {
				...resourceCreatedSecondaryViewEntity,
				locked: false,
				revisionType: RevisionType.REJECTED,
				lastUpdateDate: new Date(CUR_DATE_CONSTANT),
			};

			const newRevisionEntity: RevisionEntity = new RevisionEntity(
				null,
				rejectedNewView.lastUpdateDate,
				false,
				null,
			);

			rejectedNewView.revision = newRevisionEntity;
			newRevisionEntity.comment = rejectViewDto.comment;

			mockViewRepository.findOne.mockResolvedValue(pendingNewView);

			await viewService.approveOrDenyView(pendingNewView.id, rejectViewDto);

			expect(mockRevisionRepository.save).toHaveBeenCalledWith(newRevisionEntity);
		});
		it('should throw an error if id not found', async () => {
			mockViewRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await viewService.approveOrDenyView(3, approveViewDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find view with id 3');
		});
	});
});
