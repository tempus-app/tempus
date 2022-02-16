import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { View } from '..'
import { ViewEntity } from '../entities/view.entity'

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(ViewEntity)
    private viewsRepository: Repository<ViewEntity>,
  ) {}

  // create view
  createView(userId: string): Promise<View> {
    throw new NotImplementedException()
  }

  // edit view
  editView(view: View) {
    throw new NotImplementedException()

    // TODO: revision entity associated with view edits for approval
  }

  // delete view
  deleteSkill(viewId) {
    throw new NotImplementedException()
  }
}
