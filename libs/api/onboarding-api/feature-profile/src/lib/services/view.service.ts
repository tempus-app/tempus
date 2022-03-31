import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApproveViewDto, CreateViewDto } from '@tempus/api/shared/dto';
import { RevisionEntity, ViewEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Revision, RevisionType, View, ViewType } from '@tempus/shared-domain';
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
		viewEntity.revisionType = RevisionType.OLD;
		viewEntity.resource = resourceEntity;

		const newView = await this.viewsRepository.save(viewEntity);

		return newView;
	}

	async reviseView(resourceId: number, viewId: number, newView: CreateViewDto): Promise<Revision> {
		const view = await this.getView(viewId);

		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);
		let newViewEntity = ViewEntity.fromDto(newView);
		newViewEntity.resource = resourceEntity;
		newViewEntity.revisionType = RevisionType.NEW;
		newViewEntity = await this.viewsRepository.save(newViewEntity);

		if (view.revision) {
			const revisionEntity = view.revision;
			const previousRevision = view.revision.newView;
			await this.viewsRepository.remove(previousRevision);
			revisionEntity.newView = newViewEntity;
			const revisionToReturn = await this.revisionRepository.save(revisionEntity);
			return revisionToReturn;
		}
		const revisionEntity = new RevisionEntity(null, null, null, view as ViewEntity, newViewEntity);
		const revisionToReturn = await this.revisionRepository.save(revisionEntity);
		return revisionToReturn;
	}

	// eslint-disable-next-line consistent-return
	async approveOrDenyView(viewId: number, approveViewDto: ApproveViewDto): Promise<Revision> {
		const { approval, comment } = approveViewDto;
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
			newView.revisionType = RevisionType.OLD;
			newView.lastUpdateDate = new Date(Date.now());
			await this.viewsRepository.remove(view);
			await this.viewsRepository.save(newView);
			return this.revisionRepository.remove(revisionEntity);
		}
		if (approval === false) {
			revisionEntity.comment = comment;
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
				'certifications',
				'revision',
				'revision.view',
				'revision.newView',
			],
			where: {
				resource: {
					id: resourceId,
				},
				revisionType: RevisionType.OLD,
			},
		});

		return viewsInResource;
	}

	async getView(viewId: number): Promise<View> {
		const viewEntity = await this.viewsRepository.findOne(viewId, {
			relations: [
				'experiences',
				'educations',
				'skills',
				'certifications',
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
		if (viewEntity.type === ViewType.PRIMARY) {
			throw new ForbiddenException(`Cannot delete primary view`);
		}
		await this.viewsRepository.remove(viewEntity);
	}
}
