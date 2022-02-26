import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateViewDto, ViewEntity } from '@tempus/datalayer';
import { EducationService } from '../services/education.service';
import { ExperienceService } from '../services/experience.service';
import { SkillsService } from '../services/skill.service';

@Controller('profileview')
export class ProfileViewController {
  constructor(
    private educationService: EducationService,
    private skillService: SkillsService,
    private expService: ExperienceService,
  ) {}

  // all views of user
  @Get('/:userId')
  async getViews(@Param('userId') userId: number): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  @Get('/:viewId')
  async getView(@Param('viewId') userId: number): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  @Post('/:userId')
  async createView(@Param('userId') userId: number): Promise<ViewEntity> {
    // duplicate the primary view, obv change the name of this view though
    throw new NotImplementedException();
  }

  // will be used whenever someone edits within a view and presses save
  // this should call the view service which should call individ services and CREATE new things, not edit
  // ONLY when you edit on the main table page does it actually edit
  @Patch('/:userId')
  async editView(
    @Param('userId') userId: number,
    @Body() view: CreateViewDto,
  ): Promise<ViewEntity> {
    throw new NotImplementedException();
  }

  @Delete('/:viewId')
  async deleteView(@Param('viewId') viewId: number) {
    throw new NotImplementedException();
  }
}
