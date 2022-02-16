import { Controller, NotImplementedException, Post } from '@nestjs/common'
import { ViewsService } from '../services/view.service'

@Controller('views')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}

  @Post('/:userId')
  async createProfile() {
    throw new NotImplementedException()
  }
}
