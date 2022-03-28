import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateViewDto } from '@tempus/api/shared/dto';
import { RevisionEntity, ViewEntity } from '@tempus/api/shared/entity';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { Revision, View, ViewType } from '@tempus/shared-domain';
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
		viewEntity.resource = resourceEntity;

		const newView = await this.viewsRepository.save(viewEntity);

		return newView;
	}

	async reviseView(resourceId: number, viewId: number, newView: CreateViewDto): Promise<Revision> {
		const view = await this.getView(viewId);

		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);
		let newViewEntity = ViewEntity.fromDto(newView);
		newViewEntity.resource = resourceEntity;

		newViewEntity = await this.viewsRepository.save(newViewEntity);

		// how to decide approver? is this column even necessary
		// revisionEntity.approver = ?
		const revisionEntity = new RevisionEntity(null, null, null, null, null, view as ViewEntity, newViewEntity);
		const revisionToReturn = await this.revisionRepository.save(revisionEntity);

		return revisionToReturn;
	}

	async approveOrDenyView(viewId: number, approval: boolean): Promise<Revision> {
		const revisionEntity = (
			await this.revisionRepository.find({
				where: {
					view: { id: viewId },
				},
			})
		)[0];

		revisionEntity.approved = approval;

		// if approved, maybe set up a job or something to delete the old entity and the revision? or do we just want to delete right away
		// if denied, delete revision as well?

		return this.revisionRepository.save(revisionEntity);
	}

	async getViewsByResource(resourceId: number): Promise<View[]> {
		// error check
		await this.resourceService.getResourceInfo(resourceId);
		const viewsInResource = await this.viewsRepository.find({
			relations: ['experiences', 'educations', 'skills', 'certifications'],
			where: {
				resource: {
					id: resourceId,
				},
			},
		});

		return viewsInResource;
	}

	async getView(viewId: number): Promise<View> {
		const viewEntity = await this.viewsRepository.findOne(viewId);
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
