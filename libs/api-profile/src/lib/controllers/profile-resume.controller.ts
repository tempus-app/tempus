import { Body, Controller, Delete, Get, NotImplementedException, Param, Patch, Post, Req } from '@nestjs/common'
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
  ProfileResumeLocationInputDto,
  SlimLocationDto,
  ResumeComponentsDto,
} from '@tempus/datalayer'
import { FullSkillTypeDto } from '@tempus/datalayer'

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
    @Body() educationLocationData: ProfileResumeLocationInputDto,
  ): Promise<FullEducationDto> {
    let educationEntity = SlimEducationDto.toEntity(<SlimEducationDto>educationLocationData.data)
    const locationEntity = SlimLocationDto.toEntity(educationLocationData.location)
    educationEntity = await this.educationService.createEducation(userId, educationEntity, locationEntity)
    return FullEducationDto.fromEntity(educationEntity)
  }
  @Post('/experience/:userId')
  async createExperience(
    @Param('userId') userId: number,
    @Body() experienceLocationData: ProfileResumeLocationInputDto,
  ): Promise<FullExperienceDto> {
    let experienceEntity = SlimExperienceDto.toEntity(<SlimExperienceDto>experienceLocationData.data)
    const locationEntity = SlimLocationDto.toEntity(experienceLocationData.location)
    experienceEntity = await this.experienceService.createExperience(userId, experienceEntity, locationEntity)
    return FullExperienceDto.fromEntity(experienceEntity)
  }
  @Post('/skill/:userId')
  async createSkill(@Param('userId') userId: number, @Body() skillData: SlimSkillDto): Promise<FullSkillDto> {
    let skillEntity = SlimSkillDto.toEntity(skillData)
    skillEntity = await this.skillService.createSkill(userId, skillEntity)
    return FullSkillDto.fromEntity(skillEntity)
  }
  @Post('/certification/:userId')
  async createCertification(
    @Param('userId') userId: number,
    @Body() certificationData: SlimCertificationDto,
  ): Promise<FullCertificationDto> {
    let certificationEntity = SlimCertificationDto.toEntity(certificationData)
    certificationEntity = await this.certificationService.createCertification(userId, certificationEntity)
    return FullCertificationDto.fromEntity(certificationEntity)
  }

  // UPDATE DATA (only relevant when on main table page and editing)
  @Patch('/education')
  async editEducation(@Body() updatedEducationLocationData: ProfileResumeLocationInputDto): Promise<FullEducationDto> {
    let updatedEducationEntity = await this.educationService.editEducation(updatedEducationLocationData)
    return FullEducationDto.fromEntity(updatedEducationEntity)
  }
  @Patch('/experience')
  async editExperience(
    @Body() updatedExperienceLocationData: ProfileResumeLocationInputDto,
  ): Promise<FullExperienceDto> {
    let updatedExperienceEntity = await this.experienceService.editExperience(updatedExperienceLocationData)
    return FullExperienceDto.fromEntity(updatedExperienceEntity)
  }
  @Patch('/skill')
  async editSkill(@Body() updatedSkillData: SlimSkillDto): Promise<FullSkillDto> {
    let updatedSkillEntity = await this.skillService.editSkill(updatedSkillData)
    return FullSkillDto.fromEntity(updatedSkillEntity)
  }
  @Patch('/cerification')
  async editCertification(@Body() updatedCertificationData: SlimCertificationDto): Promise<FullCertificationDto> {
    let updatedCertificationEntity = await this.certificationService.editCertification(updatedCertificationData)
    return FullCertificationDto.fromEntity(updatedCertificationEntity)
  }

  // GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
  @Get('/education/:educationId')
  async getEducation(@Param('educationId') educationId: number): Promise<FullEducationDto> {
    const educationEntity = await this.educationService.findEducationById(educationId)
    return FullEducationDto.fromEntity(educationEntity)
  }
  @Get('/experience/:experienceId')
  async getExperience(@Param('experienceId') experienceId: number): Promise<FullExperienceDto> {
    const experienceEntity = await this.experienceService.findExperienceById(experienceId)
    return FullExperienceDto.fromEntity(experienceEntity)
  }
  @Get('/skill/:skillId')
  async getSkill(@Param('skillId') skillId: number): Promise<FullSkillDto> {
    const skillEntity = await this.skillService.findSkillById(skillId)
    return FullSkillDto.fromEntity(skillEntity)
  }
  @Get('/cerification/:certificationId')
  async getCertification(@Param('certificationId') certificationId: number): Promise<FullCertificationDto> {
    const certificationEntity = await this.certificationService.findCertificationById(certificationId)
    return FullCertificationDto.fromEntity(certificationEntity)
  }

  // Expected to be used on many pages
  @Get('/skillTypes')
  async getAllSkillTypes(): Promise<FullSkillTypeDto[]> {
    const skillTypeEntities = await this.skillService.findAllSkillTypes()
    return skillTypeEntities.map((entity) => FullSkillTypeDto.fromEntity(entity))
  }
  @Get('/education/all/:userId')
  async getAllEducationsByResource(@Param('userId') userId: number): Promise<FullEducationDto[]> {
    const educationEntities = await this.educationService.findEducationByResource(userId)
    return educationEntities.map((entity) => FullEducationDto.fromEntity(entity))
  }
  @Get('/experience/all/:userId')
  async getAllExperiencesByUser(@Param('userId') userId: number): Promise<FullExperienceDto[]> {
    const experienceEntities = await this.experienceService.findExperienceByResource(userId)
    return experienceEntities.map((entity) => FullExperienceDto.fromEntity(entity))
  }
  @Get('/certification/all/:userId')
  async getAllCertificationsByUser(@Param('userId') userId: number): Promise<FullCertificationDto[]> {
    const certificationEntities = await this.certificationService.findCertificationByResource(userId)
    return certificationEntities.map((entity) => FullCertificationDto.fromEntity(entity))
  }
  @Get('/skill/all/:userId')
  async getAllSkillsByUser(@Param('userId') userId: number): Promise<FullSkillDto[]> {
    const skillEntities = await this.skillService.findSkillsByResource(userId)
    return skillEntities.map((entity) => FullSkillDto.fromEntity(entity))
  }
  @Get('/:userId')
  async getAllResumeComponentsByUser(@Param('userId') userId: number): Promise<ResumeComponentsDto> {
    const skillDtos = (await this.skillService.findSkillsByResource(userId)).map((entity) =>
      FullSkillDto.fromEntity(entity),
    )
    const certificationDtos = (await this.certificationService.findCertificationByResource(userId)).map((entity) =>
      FullCertificationDto.fromEntity(entity),
    )
    const experienceDtos = (await this.experienceService.findExperienceByResource(userId)).map((entity) =>
      FullExperienceDto.fromEntity(entity),
    )
    const educationDtos = (await this.educationService.findEducationByResource(userId)).map((entity) =>
      FullEducationDto.fromEntity(entity),
    )

    return new ResumeComponentsDto(educationDtos, experienceDtos, skillDtos, certificationDtos)
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
