import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApproveViewDto, CreateViewDto } from '@tempus/api/shared/dto';
import { RevisionEntity, ViewEntity } from '@tempus/api/shared/entity';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Revision, RevisionType, RoleType, User, View, ViewType } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class ViewsService {
	constructor(
		@InjectRepository(ViewEntity)
		private viewsRepository: Repository<ViewEntity>,
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
		@InjectRepository(RevisionEntity) private revisionRepository: Repository<RevisionEntity>,
	) {}

	async createView(resourceId: number, createViewDto: CreateViewDto): Promise<View> {
		// error check
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		const viewEntity = ViewEntity.fromDto(createViewDto);
		viewEntity.revisionType = RevisionType.APPROVED;
		viewEntity.resource = resourceEntity;
		viewEntity.locked = false;
		viewEntity.type = 'Primary';
		viewEntity.createdAt = new Date(Date.now());
		viewEntity.lastUpdateDate = new Date(Date.now());

		const newView = await this.viewsRepository.save(viewEntity);

		return newView;
	}

	async createSecondaryView(userId: number, user: User, createViewDto: CreateViewDto): Promise<View> {
		const resourceEntity = await this.resourceService.getResourceInfo(userId);

		const viewEntity = ViewEntity.fromDto(createViewDto);
		viewEntity.resource = resourceEntity;
		viewEntity.createdAt = new Date(Date.now());
		viewEntity.lastUpdateDate = new Date(Date.now());

		if (user.roles.includes(RoleType.BUSINESS_OWNER) || user.roles.includes(RoleType.SUPERVISOR)) {
			viewEntity.revisionType = RevisionType.APPROVED;
			viewEntity.locked = false;
			viewEntity.createdBy = RoleType.BUSINESS_OWNER;
			viewEntity.updatedBy = RoleType.BUSINESS_OWNER;
		} else {
			viewEntity.revisionType = RevisionType.PENDING;
			viewEntity.locked = true;
			viewEntity.createdBy = RoleType.USER;
			viewEntity.updatedBy = RoleType.USER;
		}
		const newView = await this.viewsRepository.save(viewEntity);

		return newView;
	}

	async reviseView(viewId: number, user: User, newView: CreateViewDto): Promise<Revision | View> {
		let userRole = RoleType.USER;
		if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
			userRole = RoleType.BUSINESS_OWNER;
		} else if (user.roles.includes(RoleType.SUPERVISOR)) {
			userRole = RoleType.SUPERVISOR;
		}

		const view = await this.getView(viewId);

		if (userRole === RoleType.USER) {
			if (view.locked) throw new UnauthorizedException(`Cannot edit locked view`);
		}
		const resourceEntity = await this.resourceService.getResourceInfo(view.resource.id);

		// Create new Pending view
		let newViewEntity = ViewEntity.fromDto(newView);
		newViewEntity.resource = resourceEntity;
		newViewEntity.locked = true;
		newViewEntity.createdAt = new Date(Date.now());
		newViewEntity.updatedBy = userRole;
		newViewEntity.createdBy = view.createdBy;
		newViewEntity.viewType = view.viewType;
		newViewEntity.lastUpdateDate = new Date(Date.now());
		newViewEntity.revisionType = RevisionType.PENDING;

		// Business Owner changes are directly approved
		if (user.roles.includes(RoleType.BUSINESS_OWNER) || user.roles.includes(RoleType.SUPERVISOR)) {
			// Replace with new Approved view
			newViewEntity.createdAt = view.createdAt;
			newViewEntity.revisionType = RevisionType.APPROVED;
			newViewEntity.locked = false;
			const newApprovedView = await this.viewsRepository.save(newViewEntity);

			// Delete old view and its revisions
			const existingRevision = view.revision;
			await this.viewsRepository.remove(view);
			if (existingRevision) {
				await this.viewsRepository.remove(existingRevision.views);
				await this.revisionRepository.remove(existingRevision);
			}

			return newApprovedView;
		}

		newViewEntity = await this.viewsRepository.save(newViewEntity);

		// Lock original view so it cannot be edited again
		view.locked = true;
		await this.viewsRepository.save(view);

		// If view has been previously rejected, replace Rejected view with Pending
		if (view.revision) {
			const rejectedView = view.revision.views.find(item => item.revisionType === RevisionType.REJECTED);
			const rejectedIndex = view.revision.views.indexOf(rejectedView);
			view.revision.views[rejectedIndex] = newViewEntity;
			await this.viewsRepository.remove(rejectedView);
			const revisionToReturn = await this.revisionRepository.save(view.revision);
			return revisionToReturn;
		}

		// Otherwise create a new revision
		const revisionEntity = new RevisionEntity(null, newViewEntity.createdAt, null, [view, newViewEntity]);
		const revisionToReturn = await this.revisionRepository.save(revisionEntity);

		return revisionToReturn;
	}

	// eslint-disable-next-line consistent-return
	async approveOrDenyView(viewId: number, approveViewDto: ApproveViewDto): Promise<Revision | View> {
		const { approval, comment } = approveViewDto;
		const viewEntity = await this.viewsRepository.findOne({
			where: { id: viewId },
			relations: ['revision', 'revision.views'],
		});
		if (!viewEntity) throw new NotFoundException(`Could not find view with id ${viewId}`);

		// New secondary views
		if (viewEntity.viewType === ViewType.SECONDARY && !viewEntity.revision) {
			if (approval === true) {
				viewEntity.revisionType = RevisionType.APPROVED;
				viewEntity.locked = false;
				viewEntity.lastUpdateDate = new Date(Date.now());
				viewEntity.revision = null;
				return this.viewsRepository.save(viewEntity);
			}
			if (approval === false) {
				const revisionEntity = new RevisionEntity(null, new Date(Date.now()), false, null);
				revisionEntity.comment = comment;
				const newRevision = await this.revisionRepository.save(revisionEntity);
				viewEntity.revision = newRevision;
				viewEntity.revisionType = RevisionType.REJECTED;
				viewEntity.locked = false;
				viewEntity.lastUpdateDate = new Date(Date.now());
				await this.viewsRepository.save(viewEntity);
				return newRevision;
			}
		}

		const revisionEntity = viewEntity.revision;
		revisionEntity.approved = approval;
		revisionEntity.comment = comment;

		const sortedRevisionViews = sortViewsByLatestUpdated(revisionEntity.views);
		const latestView = sortedRevisionViews[0];
		const oldView = sortedRevisionViews[1];

		if (approval === true) {
			// If only one view, approve view
			if (revisionEntity.views.length === 1) {
				latestView.revisionType = RevisionType.APPROVED;
				latestView.lastUpdateDate = new Date(Date.now());
				latestView.revision = null;
				latestView.locked = false;
				const toReturn = await this.viewsRepository.save(latestView);
				await this.revisionRepository.remove(revisionEntity);
				return toReturn;
			}

			// Replace latest view with new Approved view, delete any revisions
			latestView.revisionType = RevisionType.APPROVED;
			latestView.lastUpdateDate = new Date(Date.now());
			latestView.revision = null;
			latestView.locked = false;
			latestView.createdAt = oldView.createdAt;
			const toReturn = await this.viewsRepository.save(latestView);

			await this.viewsRepository.remove(oldView);
			await this.revisionRepository.remove(revisionEntity);
			return toReturn;
		}
		if (approval === false) {
			revisionEntity.comment = comment;
			if (revisionEntity.views.length === 1) {
				latestView.locked = false;
				latestView.revisionType = RevisionType.REJECTED;
				await this.viewsRepository.save(latestView);
				return this.revisionRepository.save(revisionEntity);
			}
			// Update latest view to Rejected
			latestView.locked = false;
			latestView.revisionType = RevisionType.REJECTED;
			await this.viewsRepository.save(latestView);
			return this.revisionRepository.save(revisionEntity);
		}
	}

	async getViewsByResource(resourceId: number): Promise<View[]> {
		// error check
		await this.resourceService.getResourceInfo(resourceId);
		const viewsInResource = await this.viewsRepository.find({
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
					id: resourceId,
				},
			},
		});

		return viewsInResource;
	}

	async getViewsNamesByResource(resourceId: number): Promise<View[]> {
		await this.resourceService.getResourceInfo(resourceId);
		const viewsInResource = await this.viewsRepository
			.createQueryBuilder('view')
			.where('view.resource.id = :resourceId', { resourceId })
			.select(['type', 'id'])
			.execute();

		return viewsInResource;
	}

	async getView(viewId: number): Promise<View> {
		const viewEntity = await this.viewsRepository.findOne(viewId, {
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
		if (!viewEntity) {
			throw new NotFoundException(`Could not find view with id ${viewId}`);
		}

		if (viewEntity.revision) {
			const sortedViews = sortViewsByLatestUpdated(viewEntity.revision.views);
			const newView = sortedViews[0];
			const revisionNewView = await this.viewsRepository.findOne(newView.id, {
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

			const index = viewEntity.revision.views.indexOf(newView);
			viewEntity.revision.views[index] = revisionNewView;
		}

		return viewEntity;
	}

	// delete view
	async deleteView(viewId: number) {
		const viewEntity = await this.viewsRepository.findOne(viewId);
		if (!viewEntity) {
			throw new NotFoundException(`Could not find view with id ${viewId}`);
		}
		if (viewEntity.viewType === ViewType.PRIMARY) {
			throw new ForbiddenException(`Cannot delete primary view`);
		}
		await this.viewsRepository.remove(viewEntity);
	}

	async getViewsByStatus(status: RevisionType, page: number, pageSize: number) {
		const viewsAndCount = await this.viewsRepository.findAndCount({
			where: { revisionType: status },
			relations: ['resource'],
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
		});
		return { views: viewsAndCount[0], totalPendingApprovals: viewsAndCount[1] };
	}
}
