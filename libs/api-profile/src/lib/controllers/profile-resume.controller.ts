import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Req } from '@nestjs/common'
import { Experience } from '../models/experience.model'
import { Skill } from '../models/skill.model'
import { Education } from '../models/education.model'
import { EducationService } from '../services/education.service'
import { ExperienceService } from '../services/experience.service'
import { SkillsService } from '../services/skill.service'

@Controller('profileresume')
export class ProfileResumeController {
  constructor(
    private educationService: EducationService,
    private skillService: SkillsService,
    private expService: ExperienceService,
  ) {}

  // CREATE DATA (only relevant when on main table page and creating)
  @Post('/education/:userId')
  async createEducation(@Param('userId') userId: number, @Body() education: Education): Promise<Education> {
    throw new NotImplementedException()
  }
  @Post('/experience/:userId')
  async createExperience(@Param('userId') userId: number, @Body() experience: Experience): Promise<Experience> {
    throw new NotImplementedException()
  }
  @Post('/skill/:userId')
  async createSkill(@Param('userId') userId: number, @Body() skill: Skill): Promise<Skill> {
    throw new NotImplementedException()
  }

  // UPDATE DATA (only relevant when on main table page and editing)
  @Patch('/education/:educationId')
  async updateEducation(@Param('educationId') educationId: number, @Body() education: Education): Promise<Education> {
    throw new NotImplementedException()
  }
  @Patch('/experience/:experienceId')
  async updateExperience(
    @Param('experienceId') experienceId: number,
    @Body() experience: Experience,
  ): Promise<Experience> {
    throw new NotImplementedException()
  }
  @Patch('/skill/:skillId')
  async updateSkill(@Param('skillId') skillId: number, @Body() skill: Skill): Promise<Skill> {
    throw new NotImplementedException()
  }

  // GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
  @Get('/education/:educationId')
  async getEducation(@Param('educationId') educationId: number, @Body() education: Education): Promise<Education> {
    throw new NotImplementedException()
  }
  @Get('/experience/:experienceId')
  async getExperience(
    @Param('experienceId') experienceId: number,
    @Body() experience: Experience,
  ): Promise<Experience> {
    throw new NotImplementedException()
  }
  @Get('/skill/:skillId')
  async getSkill(@Param('skillId') skillId: number, @Body() skill: Skill): Promise<Skill> {
    throw new NotImplementedException()
  }
  @Get('/:userId')
  async getAll(@Param('userId') userId: number): Promise<{
    educations: Education[]
    experiences: Experience[]
    skills: Skill[]
  }> {
    throw new NotImplementedException()
  }
}
