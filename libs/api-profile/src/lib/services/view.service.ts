import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from '@tempus/api-account';
import { CreateViewDto, ResourceEntity, View, ViewEntity, ViewType } from '@tempus/datalayer';
import { Repository } from 'typeorm';

@Injectable()
export class ViewsService {
	constructor(
		@InjectRepository(ViewEntity)
		private viewsRepository: Repository<ViewEntity>,
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
	) {}

	async createView(resourceId: number): Promise<View> {
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);
		const primaryView: ViewEntity = (
			await this.viewsRepository.find({
				where: {
					resource: resourceEntity,
					viewType: ViewType.PRIMARY,
				},
			})
		)[0];

		primaryView.id = null;
		primaryView.viewType = ViewType.SECONDARY;

		primaryView.resource = resourceEntity;

		return await this.viewsRepository.save(primaryView);
	}

	async createInitialView(resource: ResourceEntity, createViewDto: CreateViewDto): Promise<View> {
		const view = CreateViewDto.toEntity(createViewDto);

		view.resource = resource;

		return await this.viewsRepository.save(view);
	}

	// edit view
	editView(view: CreateViewDto): Promise<View> {
		throw new NotImplementedException();

		// TODO: revision entity associated with view edits for approval
	}

	async getViewsByResource(resourceId: number): Promise<View[]> {
		// error check
		await this.resourceService.getResourceInfo(resourceId);

		return await this.viewsRepository.find({
			relations: ['experiences', 'educations', 'skills', 'certifications'],
			where: {
				resource: {
					id: resourceId,
				},
			},
		});
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
			throw new NotFoundException(`Could not find view with ID ${viewId}`);
		}
		if (viewEntity.type === ViewType.PRIMARY) {
			throw new ForbiddenException(`Cannot delete primary view`);
		}
		await this.viewsRepository.remove(viewEntity);
	}
}
