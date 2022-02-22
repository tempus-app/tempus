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
  ProfileResumeLocationInputDto,
  SlimLocationDto,
  ResumeComponentsDto,
} from '@tempus/datalayer'
import { FullSkillTypeDto } from 'libs/datalayer/src/lib/dtos/profile-dtos/skill/fullSkillType.dto'

@Controller('profileresume')
export class ProfileResumeController {
  constructor(
    private educationService: EducationService,
    private skillService: SkillsService,
    private expService: ExperienceService,
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
    let locationEntity = SlimLocationDto.toEntity(educationLocationData.location)
    educationEntity = await this.educationService.createEducation(userId, educationEntity, locationEntity)
    return FullEducationDto.fromEntity(educationEntity)
  }
  @Post('/experience/:userId')
  async createExperience(
    @Param('userId') userId: number,
    @Body() experienceLocationData: ProfileResumeLocationInputDto,
  ): Promise<FullExperienceDto> {
    let experienceEntity = SlimExperienceDto.toEntity(<SlimExperienceDto>experienceLocationData.data)
    let locationEntity = SlimLocationDto.toEntity(experienceLocationData.location)
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
  async editEducation(@Body() updatedEducationData: SlimEducationDto): Promise<FullEducationDto> {
    let updatedEducationEntity = SlimEducationDto.toEntity(updatedEducationData)
    updatedEducationEntity = await this.educationService.editEducation(updatedEducationEntity)
    return FullEducationDto.fromEntity(updatedEducationEntity)
  }
  @Patch('/experience')
  async editExperience(@Body() updatedExperienceData: SlimExperienceDto): Promise<FullExperienceDto> {
    let updatedExperienceEntity = SlimExperienceDto.toEntity(updatedExperienceData)
    updatedExperienceEntity = await this.experienceService.editExperience(updatedExperienceData)
    return FullExperienceDto.fromEntity(updatedExperienceEntity)
  }
  @Patch('/skill')
  async editSkill(@Body() updatedSkillData: SlimSkillDto): Promise<FullSkillDto> {
    let updatedSkillEntity = SlimSkillDto.toEntity(updatedSkillData)
    updatedSkillEntity = await this.skillService.editSkill(updatedSkillEntity)
    return FullSkillDto.fromEntity(updatedSkillEntity)
  }
  @Patch('/cerification')
  async editCertification(@Body() updatedCertificationData: SlimCertificationDto): Promise<FullCertificationDto> {
    let updatedCertificationEntity = SlimCertificationDto.toEntity(updatedCertificationData)
    updatedCertificationEntity = await this.certificationService.editCertification(updatedCertificationEntity)
    return FullCertificationDto.fromEntity(updatedCertificationEntity)
  }

  // GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
  @Get('/education/:educationId')
  async getEducation(@Param('educationId') educationId: number): Promise<FullEducationDto> {
    let educationEntity = await this.educationService.findEducationById(educationId)
    return FullEducationDto.fromEntity(educationEntity)
  }
  @Get('/experience/:experienceId')
  async getExperience(@Param('experienceId') experienceId: number): Promise<FullExperienceDto> {
    let experienceEntity = await this.experienceService.findExperienceById(experienceId)
    return FullExperienceDto.fromEntity(experienceEntity)
  }
  @Get('/skill/:skillId')
  async getSkill(@Param('skillId') skillId: number): Promise<FullSkillDto> {
    let skillEntity = await this.skillService.findSkillById(skillId)
    return FullSkillDto.fromEntity(skillEntity)
  }
  @Get('/cerification/:certificationId')
  async getCertification(@Param('certificationId') certificationId: number): Promise<FullCertificationDto> {
    let certificationEntity = await this.certificationService.findCertificationById(certificationId)
    return FullCertificationDto.fromEntity(certificationEntity)
  }

  // Expected to be used on many pages
  @Get('/skillTypes')
  async getAllSkillTypes(): Promise<FullSkillTypeDto[]> {
    let skillTypeEntities = await this.skillService.findAllSkillTypes()
    return skillTypeEntities.map((entity) => FullSkillTypeDto.fromEntity(entity))
  }
  @Get('/education/all/:userId')
  async getAllEducationsByResource(@Param('userId') userId: number): Promise<FullEducationDto[]> {
    let educationEntities = await this.educationService.findEducationByResource(userId)
    return educationEntities.map((entity) => FullEducationDto.fromEntity(entity))
  }
  @Get('/experience/all/:userId')
  async getAllExperiencesByUser(@Param('userId') userId: number): Promise<FullExperienceDto[]> {
    let experienceEntities = await this.experienceService.findExperienceByResource(userId)
    return experienceEntities.map((entity) => FullExperienceDto.fromEntity(entity))
  }
  @Get('/certification/all/:userId')
  async getAllCertificationsByUser(@Param('userId') userId: number): Promise<FullCertificationDto[]> {
    let certificationEntities = await this.certificationService.findCertificationByResource(userId)
    return certificationEntities.map((entity) => FullCertificationDto.fromEntity(entity))
  }
  @Get('/skill/all/:userId')
  async getAllSkillsByUser(@Param('userId') userId: number): Promise<FullSkillDto[]> {
    let skillEntities = await this.skillService.findSkillsByResource(userId)
    return skillEntities.map((entity) => FullSkillDto.fromEntity(entity))
  }
  @Get('/:userId')
  async getAllResumeComponentsByUser(@Param('userId') userId: number): Promise<ResumeComponentsDto> {
    let skillDtos = (await this.skillService.findSkillsByResource(userId)).map((entity) =>
      FullSkillDto.fromEntity(entity),
    )
    let certificationDtos = (await this.certificationService.findCertificationByResource(userId)).map((entity) =>
      FullCertificationDto.fromEntity(entity),
    )
    let experienceDtos = (await this.experienceService.findExperienceByResource(userId)).map((entity) =>
      FullExperienceDto.fromEntity(entity),
    )
    let educationDtos = (await this.educationService.findEducationByResource(userId)).map((entity) =>
      FullEducationDto.fromEntity(entity),
    )

    return new ResumeComponentsDto(educationDtos, experienceDtos, skillDtos, certificationDtos)
  }
}
