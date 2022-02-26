import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateViewDto, ViewEntity } from '@tempus/datalayer';
import { Repository } from 'typeorm';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(ViewEntity)
    private viewsRepository: Repository<ViewEntity>,
  ) {}

  // create view for resource
  createView(resourceId: number): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  // edit view
  editView(view: CreateViewDto): Promise<ViewEntity> {
    throw new NotImplementedException();

    // TODO: revision entity associated with view edits for approval
  }

  getViewsByResource(resourceId: number): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  getView(viewId: number): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  // delete view
  deleteView(viewId: number) {
    throw new NotImplementedException();
  }
}
