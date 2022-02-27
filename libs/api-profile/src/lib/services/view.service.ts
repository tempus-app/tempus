import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from '@tempus/api-account';
import { CreateViewDto, ViewEntity } from '@tempus/datalayer';
import { Repository } from 'typeorm';

@Injectable()
export class ViewsService {
	constructor(
		@InjectRepository(ViewEntity)
		private viewsRepository: Repository<ViewEntity>,
		private resourceService: ResourceService,
	) {}

	async createView(resourceId: number, view: ViewEntity): Promise<ViewEntity> {
		return await this.viewsRepository.save({ resource: { id: resourceId }, ...view });
	}

	async createInitialView() {}

	// edit view
	editView(view: CreateViewDto): Promise<ViewEntity> {
		throw new NotImplementedException();

		// TODO: revision entity associated with view edits for approval
	}

	async getViewsByResource(resourceId: number): Promise<ViewEntity[]> {
		// error check
		const resource = await this.resourceService.getResourceInfo(resourceId);

		return await this.viewsRepository.find({
			where: {
				resource: {
					id: resourceId,
				},
			},
		});
	}

	async getView(viewId: number): Promise<ViewEntity> {
		const viewEntity = await this.viewsRepository.findOne(viewId);
		if (!viewEntity) {
			throw new NotFoundException(`Could not find view with id ${viewId}`);
		}
		return viewEntity;
	}

	// delete view
	async deleteView(viewId: number) {
		const viewEntity = await this.getView(viewId);
		return viewEntity;
	}
}
