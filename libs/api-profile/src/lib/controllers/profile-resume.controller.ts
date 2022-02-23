import { Body, Controller, Delete, Get, NotImplementedException, Param, Patch, Post, Req } from '@nestjs/common'
import { EducationService } from '../services/education.service'
import { ExperienceService } from '../services/experience.service'
import { SkillsService } from '../services/skill.service'
import { CertificationService } from '../services/certificate.service'
import {
  Certification,
  CreateCertificationDto,
  CreateEducationDto,
  CreateExperienceDto,
  CreateSkillDto,
  Education,
  Experience,
  Skill,
  SkillType,
  UpdateCertificationDto,
  UpdateEducationDto,
  UpdateExperienceDto,
  UpdateSkillDto,
  ResumeComponentsDto,
} from '@tempus/datalayer'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Profile Resume Components')
@Controller('profileresume')
export class ProfileResumeController {
  constructor(
    private educationService: EducationService,
    private skillService: SkillsService,
    private certificationService: CertificationService,
    private experienceService: ExperienceService,
  ) {}

  // CREATE DATA (only relevant when on main table page and creating)
  @Post('/education/:userId')
  async createEducation(
    @Param('userId') userId: number,
    @Body() createEducationData: CreateEducationDto,
  ): Promise<Education> {
    let educationEntity = CreateEducationDto.toEntity(createEducationData)
    educationEntity = await this.educationService.createEducation(userId, educationEntity)
    return educationEntity
  }
  @Post('/experience/:userId')
  async createExperience(
    @Param('userId') userId: number,
    @Body() createExperienceData: CreateExperienceDto,
  ): Promise<Experience> {
    let experienceEntity = CreateExperienceDto.toEntity(createExperienceData)
    experienceEntity = await this.experienceService.createExperience(userId, experienceEntity)
    return experienceEntity
  }
  @Post('/skill/:userId')
  async createSkill(@Param('userId') userId: number, @Body() createSkillData: CreateSkillDto): Promise<Skill> {
    let skillEntity = CreateSkillDto.toEntity(createSkillData)
    skillEntity = await this.skillService.createSkill(userId, skillEntity)
    return skillEntity
  }
  @Post('/certification/:userId')
  async createCertification(
    @Param('userId') userId: number,
    @Body() createCertificationData: CreateCertificationDto,
  ): Promise<Certification> {
    let certificationEntity = CreateCertificationDto.toEntity(createCertificationData)
    certificationEntity = await this.certificationService.createCertification(userId, certificationEntity)
    return certificationEntity
  }

  // UPDATE DATA (only relevant when on main table page and editing)
  @Patch('/education')
  async editEducation(@Body() updateEducationData: UpdateEducationDto): Promise<Education> {
    let updatedEducationEntity = await this.educationService.editEducation(updateEducationData)
    return updatedEducationEntity
  }
  @Patch('/experience')
  async editExperience(@Body() updateExperienceData: UpdateExperienceDto): Promise<Experience> {
    let updatedExperienceEntity = await this.experienceService.editExperience(updateExperienceData)
    return updatedExperienceEntity
  }
  @Patch('/skill')
  async editSkill(@Body() updatedSkillData: UpdateSkillDto): Promise<Skill> {
    let updatedSkillEntity = await this.skillService.editSkill(updatedSkillData)
    return updatedSkillEntity
  }
  @Patch('/cerification')
  async editCertification(@Body() updatedCertificationData: UpdateCertificationDto): Promise<Certification> {
    let updatedCertificationEntity = await this.certificationService.editCertification(updatedCertificationData)
    return updatedCertificationEntity
  }

  // GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
  @Get('/education/:educationId')
  async getEducation(@Param('educationId') educationId: number): Promise<Education> {
    let educationEntity = await this.educationService.findEducationById(educationId)
    return educationEntity
  }
  @Get('/experience/:experienceId')
  async getExperience(@Param('experienceId') experienceId: number): Promise<Experience> {
    let experienceEntity = await this.experienceService.findExperienceById(experienceId)
    return experienceEntity
  }
  @Get('/skill/:skillId')
  async getSkill(@Param('skillId') skillId: number): Promise<Skill> {
    let skillEntity = await this.skillService.findSkillById(skillId)
    return skillEntity
  }
  @Get('/cerification/:certificationId')
  async getCertification(@Param('certificationId') certificationId: number): Promise<Certification> {
    let certificationEntity = await this.certificationService.findCertificationById(certificationId)
    return certificationEntity
  }

  // Expected to be used on many pages
  @Get('/skillTypes')
  async getAllSkillTypes(): Promise<SkillType[]> {
    let skillTypeEntities = await this.skillService.findAllSkillTypes()
    return skillTypeEntities
  }
  @Get('/education/all/:userId')
  async getAllEducationsByResource(@Param('userId') userId: number): Promise<Education[]> {
    let educationEntities = await this.educationService.findEducationByResource(userId)
    return educationEntities
  }
  @Get('/experience/all/:userId')
  async getAllExperiencesByUser(@Param('userId') userId: number): Promise<Experience[]> {
    let experienceEntities = await this.experienceService.findExperienceByResource(userId)
    return experienceEntities
  }
  @Get('/certification/all/:userId')
  async getAllCertificationsByUser(@Param('userId') userId: number): Promise<Certification[]> {
    let certificationEntities = await this.certificationService.findCertificationByResource(userId)
    return certificationEntities
  }
  @Get('/skill/all/:userId')
  async getAllSkillsByUser(@Param('userId') userId: number): Promise<Skill[]> {
    let skillEntities = await this.skillService.findSkillsByResource(userId)
    return skillEntities
  }
  @Get('/:userId')
  async getAllResumeComponentsByUser(@Param('userId') userId: number): Promise<ResumeComponentsDto> {
    let skillEntities = await this.skillService.findSkillsByResource(userId)
    let certificationEntities = await this.certificationService.findCertificationByResource(userId)
    let experienceEntities = await this.experienceService.findExperienceByResource(userId)
    let educationEntities = await this.educationService.findEducationByResource(userId)

    return new ResumeComponentsDto(educationEntities, experienceEntities, skillEntities, certificationEntities)
  }

  // DELETES only to be used on the main table page (no delete capability on views)
  @Delete('/education/:educationId')
  async deleteEducation(@Param('educationId') educationId: number): Promise<void> {
    return await this.educationService.deleteEducation(educationId)
  }
  @Delete('/experience/:experienceId')
  async deleteExperience(@Param('experienceId') experienceId: number): Promise<void> {
    return await this.experienceService.deleteExperience(experienceId)
  }
  @Delete('/certification/:certificationId')
  async deleteCertification(@Param('certificationId') certificationId: number): Promise<void> {
    return await this.certificationService.deleteCertification(certificationId)
  }
  @Delete('/skill/:skillId')
  async deleteSkill(@Param('skillId') skillId: number): Promise<void> {
    return await this.skillService.deleteSkill(skillId)
  }
}
