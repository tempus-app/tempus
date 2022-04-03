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
		viewEntity.type = 'PROFILE';
		viewEntity.createdAt = new Date(Date.now());
		viewEntity.lastUpdateDate = new Date(Date.now());

		const newView = await this.viewsRepository.save(viewEntity);

		return newView;
	}

	async reviseView(viewId: number, user: User, newView: CreateViewDto): Promise<Revision> {
		const view = await this.getView(viewId);

		if (view.locked) throw new UnauthorizedException(`Cannot edit locked view`);

		const resourceEntity = await this.resourceService.getResourceInfo(view.resource.id);
		let newViewEntity = ViewEntity.fromDto(newView);
		newViewEntity.resource = resourceEntity;
		newViewEntity.locked = true;
		newViewEntity.createdAt = new Date(Date.now());
		newViewEntity.updatedBy = user.roles.includes(RoleType.BUSINESS_OWNER) ? RoleType.BUSINESS_OWNER : RoleType.USER;
		newViewEntity.createdBy = view.createdBy;
		newViewEntity.viewType = view.viewType;
		newViewEntity.type = view.type;
		newViewEntity.lastUpdateDate = new Date(Date.now());
		newViewEntity.revisionType = RevisionType.PENDING;

		if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
			newViewEntity.createdAt = view.createdAt;
			newViewEntity.revisionType = RevisionType.APPROVED;
			await this.viewsRepository.remove(view);
			await this.viewsRepository.save(newViewEntity);
			return null;
		}
		newViewEntity = await this.viewsRepository.save(newViewEntity);

		view.locked = true;
		await this.viewsRepository.save(view);

		if (view.revision) {
			const revisionEntity = view.revision;
			const previousRevision = view.revision.newView;
			revisionEntity.newView = newViewEntity;
			await this.revisionRepository.save(revisionEntity);
			await this.viewsRepository.remove(previousRevision);
			const revisionToReturn = await this.revisionRepository.save(revisionEntity);
			return revisionToReturn;
		}
		const revisionEntity = new RevisionEntity(null, newViewEntity.createdAt, null, view as ViewEntity, newViewEntity);
		const revisionToReturn = await this.revisionRepository.save(revisionEntity);
		return revisionToReturn;
	}

	// eslint-disable-next-line consistent-return
	async approveOrDenyView(viewId: number, approveViewDto: ApproveViewDto): Promise<Revision> {
		const { approval, comment } = approveViewDto;
		const viewEntity = await this.viewsRepository.findOne({ where: { id: viewId } });
		if (!viewEntity) throw new NotFoundException(`Could not find view with id ${viewId}`);

		const revisionEntity = (
			await this.revisionRepository.find({
				where: {
					view: { id: viewId },
				},
			})
		)[0];

		revisionEntity.approved = approval;

		if (approval === true) {
			const { newView, view } = revisionEntity;
			newView.revisionType = RevisionType.APPROVED;
			newView.lastUpdateDate = new Date(Date.now());
			await this.viewsRepository.remove(view);
			newView.locked = false;
			newView.createdAt = view.createdAt;
			await this.viewsRepository.save(newView);
			return this.revisionRepository.remove(revisionEntity);
		}
		if (approval === false) {
			revisionEntity.comment = comment;
			viewEntity.locked = false;
			viewEntity.revisionType = RevisionType.REJECTED;
			await this.viewsRepository.save(viewEntity);
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
				'revision.view',
				'revision.newView',
			],
			where: {
				resource: {
					id: resourceId,
				},
				// revisionType: RevisionType.APPROVED,
			},
		});

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
				'revision.view',
				'revision.newView',
			],
		});
		if (!viewEntity) {
			throw new NotFoundException(`Could not find view with id ${viewId}`);
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
}
