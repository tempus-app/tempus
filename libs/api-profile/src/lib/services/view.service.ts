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

	async createView(resourceId: number, createViewDto: CreateViewDto): Promise<View> {
		// error check
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);

		const viewEntity = CreateViewDto.toEntity(createViewDto);
		viewEntity.resource = resourceEntity;

		return await this.viewsRepository.save(viewEntity);
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
			throw new NotFoundException(`Could not find view with id ${viewId}`);
		}
		if (viewEntity.type === ViewType.PRIMARY) {
			throw new ForbiddenException(`Cannot delete primary view`);
		}
		await this.viewsRepository.remove(viewEntity);
	}
}
