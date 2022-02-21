import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Req } from '@nestjs/common'
import { EducationService } from '../services/education.service'
import { ExperienceService } from '../services/experience.service'
import { SkillsService } from '../services/skill.service'
import { CertificationService } from '../services/certificate.service'
import {
  SlimCertificationDto,
  SlimEducationDto,
  SlimExperienceDto,
  FullCertificationDto,
  FullEducationDto,
  FullExperienceDto,
  FullSkillDto,
  SlimSkillDto,
  EducationEntity,
} from '@tempus/datalayer'

@Controller('profileresume')
export class ProfileResumeController {
  constructor(
    private educationService: EducationService,
    private skillService: SkillsService,
    private expService: ExperienceService,
    private certificationService: CertificationService,
  ) {}

  // CREATE DATA (only relevant when on main table page and creating)
  @Post('/education/:userId')
  async createEducation(
    @Param('userId') userId: number,
    @Body() education: SlimEducationDto,
  ): Promise<FullEducationDto> {
    return this.educationService.createEducation(userId, education)
  }
  @Post('/experience/:userId')
  async createExperience(
    @Param('userId') userId: number,
    @Body() experience: SlimExperienceDto,
  ): Promise<FullExperienceDto> {
    throw new NotImplementedException()
  }
  @Post('/skill/:userId')
  async createSkill(@Param('userId') userId: number, @Body() skill: SlimSkillDto): Promise<FullSkillDto> {
    throw new NotImplementedException()
  }
  @Post('/certification/:userId')
  async createCertification(
    @Param('userId') userId: number,
    @Body() certification: SlimCertificationDto,
  ): Promise<FullCertificationDto> {
    throw new NotImplementedException()
  }

  // UPDATE DATA (only relevant when on main table page and editing)
  @Patch('/education/:educationId')
  async editEducation(
    @Param('educationId') educationId: number,
    @Body() education: SlimEducationDto,
  ): Promise<FullEducationDto> {
    return await this.educationService.editEducation(education)
  }
  @Patch('/experience/:experienceId')
  async editExperience(
    @Param('experienceId') experienceId: number,
    @Body() experience: SlimExperienceDto,
  ): Promise<FullExperienceDto> {
    throw new NotImplementedException()
  }
  @Patch('/skill/:skillId')
  async editSkill(@Param('skillId') skillId: number, @Body() skill: SlimSkillDto): Promise<FullSkillDto> {
    throw new NotImplementedException()
  }
  @Patch('/cerification/:certificationId')
  async editCertification(
    @Param('certificationId') certificationId: number,
    @Body() certification: SlimCertificationDto,
  ): Promise<FullCertificationDto> {
    throw new NotImplementedException()
  }

  // GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
  @Get('/education/:educationId')
  async getEducation(
    @Param('educationId') educationId: number,
    @Body() education: SlimEducationDto,
  ): Promise<FullEducationDto> {
    throw new NotImplementedException()
  }
  @Get('/experience/:experienceId')
  async getExperience(
    @Param('experienceId') experienceId: number,
    @Body() experience: SlimExperienceDto,
  ): Promise<FullEducationDto> {
    throw new NotImplementedException()
  }
  @Get('/skill/:skillId')
  async getSkill(@Param('skillId') skillId: number, @Body() skill: SlimSkillDto): Promise<FullSkillDto> {
    throw new NotImplementedException()
  }
  @Get('/cerification/:certificationId')
  async getCertification(
    @Param('certificationId') certificationId: number,
    @Body() certification: SlimCertificationDto,
  ): Promise<FullCertificationDto> {
    throw new NotImplementedException()
  }
  @Get('/:userId')
  async getAll(@Param('userId') userId: number): Promise<{
    educations: FullEducationDto[]
    experiences: FullExperienceDto[]
    skills: FullSkillDto[]
    certifications: FullCertificationDto[]
  }> {
    throw new NotImplementedException()
  }
}
